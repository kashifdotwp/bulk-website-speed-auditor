/**
 * Business Category definitions and auto-detection logic
 */

export const CATEGORY_DEFINITIONS = [
  { id: 'saas', label: 'SaaS / Tech', badge: '💻 SaaS', color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.12)' },
  { id: 'ecommerce', label: 'Ecommerce', badge: '🛍️ Ecommerce', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
  { id: 'local', label: 'Local Business', badge: '📍 Local Business', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)' },
  { id: 'agency', label: 'Agency / B2B', badge: '💼 Agency / B2B', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' },
  { id: 'other', label: 'General / Other', badge: '🌐 General', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' }
];

export function autoDetectCategory(item) {
  if (!item) return 'other';
  const text = `${item.domain || ''} ${item.originalData?.company || ''} ${item.originalData?.industry || ''} ${item.originalData?.source || ''} ${item.url || ''}`.toLowerCase();

  // 1. Ecommerce
  if (/shop|store|cart|cloth|shoe|jewel|apparel|product|ecommerce|shopify|woocommerce|buy|retail/i.test(text)) {
    return 'ecommerce';
  }

  // 2. Local Business
  if (/lawyer|attorney|dental|dentist|clinic|plumb|roof|hvac|doctor|electric|clean|auto|repair|physio|realtor|broker|medspa|salon|chiro|vet/i.test(text) || Boolean(item.originalData?.city)) {
    return 'local';
  }

  // 3. SaaS / Software
  if (/saas|app\b|software|platform|cloud|ai\b|bot\b|crm|api\b|analytics|tool|automation/i.test(text) || /\.(io|ai|app|tech)$/i.test(item.domain || '')) {
    return 'saas';
  }

  // 4. Agency / Services
  if (/agency|marketing|consult|studio|creative|media|seo|ads|design|digital/i.test(text)) {
    return 'agency';
  }

  return 'other';
}
