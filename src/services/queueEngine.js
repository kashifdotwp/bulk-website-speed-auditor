import { runPageSpeedAudit } from './psiApi';

/**
 * Concurrency Queue Manager for Official Google PageSpeed Audits
 * Integrates rate-limiting pause/gap to respect Google API quotas
 */
export class AuditQueueEngine {
  constructor({
    concurrency = 2,
    delayGap = 2.0,
    strategy = 'both',
    apiKey = '',
    onProgress = () => {},
    onItemComplete = () => {},
    onFinish = () => {}
  }) {
    this.concurrency = concurrency;
    this.delayGap = delayGap; // Delay in seconds between requests
    this.strategy = strategy;
    this.apiKey = apiKey;
    this.onProgress = onProgress;
    this.onItemComplete = onItemComplete;
    this.onFinish = onFinish;

    this.queue = [];
    this.total = 0;
    this.completed = 0;
    this.activeWorkers = 0;
    this.activeUrls = new Set();
    this.results = [];
    this.isPaused = false;
    this.isCancelled = false;
    this.isRunning = false;
    this.startTime = null;
    this.abortControllers = new Map();
  }

  setConcurrency(val) {
    this.concurrency = Math.max(1, Math.min(val, 6));
  }

  setDelayGap(seconds) {
    this.delayGap = Math.max(0, Math.min(seconds, 10));
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  setStrategy(strat) {
    this.strategy = strat;
  }

  /**
   * Loads items into the queue and starts processing
   */
  start(items) {
    this.queue = [...items];
    this.total = items.length;
    this.completed = 0;
    this.results = [];
    this.isPaused = false;
    this.isCancelled = false;
    this.isRunning = true;
    this.startTime = Date.now();

    this.emitProgress();
    this.spawnWorkers();
  }

  pause() {
    this.isPaused = true;
    this.emitProgress();
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.emitProgress();
    this.spawnWorkers();
  }

  cancel() {
    this.isCancelled = true;
    this.isRunning = false;
    this.isPaused = false;
    this.queue = [];
    
    // Abort active fetches
    for (const ctrl of this.abortControllers.values()) {
      try {
        ctrl.abort();
      } catch {
        // Ignore
      }
    }
    this.abortControllers.clear();
    this.activeUrls.clear();
    this.emitProgress();
  }

  spawnWorkers() {
    if (this.isPaused || this.isCancelled || !this.isRunning) return;

    while (this.activeWorkers < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeWorkers++;
      this.activeUrls.add(item.url);
      this.emitProgress();

      this.processItem(item).finally(async () => {
        this.activeWorkers--;
        this.activeUrls.delete(item.url);
        this.emitProgress();

        // Rate-limit pause/gap between sequential batches to respect Google restrictions
        if (this.delayGap > 0 && this.queue.length > 0 && !this.isCancelled) {
          await new Promise(r => setTimeout(r, this.delayGap * 1000));
        }

        if (this.queue.length > 0 && !this.isPaused && !this.isCancelled) {
          this.spawnWorkers();
        } else if (this.activeWorkers === 0 && this.queue.length === 0) {
          this.isRunning = false;
          this.emitProgress();
          this.onFinish(this.results);
        }
      });
    }
  }

  async processItem(item) {
    if (this.isCancelled) return;

    const controller = new AbortController();
    this.abortControllers.set(item.id || item.url, controller);

    try {
      const auditData = await runPageSpeedAudit(
        item.url,
        this.strategy,
        this.apiKey,
        controller.signal
      );

      const mergedResult = {
        ...auditData,
        id: item.id || `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        originalData: item.originalData || { website: item.url, domain: item.domain }
      };

      this.results.push(mergedResult);
      this.completed++;
      this.onItemComplete(mergedResult);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      const failResult = {
        id: item.id || `res_${Date.now()}`,
        success: false,
        url: item.url,
        domain: item.domain || item.url,
        strategy: this.strategy,
        error: err.message || 'Audit failed',
        originalData: item.originalData || {},
        auditedAt: new Date().toISOString()
      };
      this.results.push(failResult);
      this.completed++;
      this.onItemComplete(failResult);
    } finally {
      this.abortControllers.delete(item.id || item.url);
    }
  }

  emitProgress() {
    const elapsedMs = this.startTime ? Date.now() - this.startTime : 0;
    const progressPct = this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
    
    // Calculate Estimated Time Remaining
    let etaSeconds = 0;
    if (this.completed > 0 && this.queue.length > 0) {
      const avgMsPerItem = elapsedMs / this.completed;
      const remainingItems = this.queue.length + this.activeWorkers;
      const concurrencyFactor = Math.max(1, this.concurrency * 0.9);
      etaSeconds = Math.round(((remainingItems * (avgMsPerItem + (this.delayGap * 1000))) / concurrencyFactor) / 1000);
    } else if (this.total > 0 && this.completed === 0) {
      // Initial estimate: ~12s per item divided by concurrency
      etaSeconds = Math.round((this.total * (12 + this.delayGap)) / Math.max(1, this.concurrency));
    }

    this.onProgress({
      total: this.total,
      completed: this.completed,
      remaining: this.queue.length,
      activeWorkers: this.activeWorkers,
      activeUrls: Array.from(this.activeUrls),
      progressPct,
      etaSeconds,
      delayGap: this.delayGap,
      isPaused: this.isPaused,
      isRunning: this.isRunning,
      isCancelled: this.isCancelled
    });
  }
}
