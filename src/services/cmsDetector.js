/**
 * CMS & Web Framework Definitions and Badge Styles
 */

export const CMS_DEFINITIONS = [
  { id: 'WordPress', label: 'WordPress', icon: 'ⓦ', color: '#0073aa', bg: 'rgba(0, 115, 170, 0.12)', border: '#0073aa40' },
  { id: 'Shopify', label: 'Shopify', icon: '🛍️', color: '#008060', bg: 'rgba(0, 128, 96, 0.12)', border: '#00806040' },
  { id: 'Next.js', label: 'Next.js', icon: '▲', color: '#0f172a', bg: 'rgba(15, 23, 42, 0.12)', border: '#0f172a40' },
  { id: 'WooCommerce', label: 'WooCommerce', icon: '🟣', color: '#7f54b3', bg: 'rgba(127, 84, 179, 0.12)', border: '#7f54b340' },
  { id: 'Webflow', label: 'Webflow', icon: '⚡', color: '#146ef5', bg: 'rgba(20, 110, 245, 0.12)', border: '#146ef540' },
  { id: 'Wix', label: 'Wix', icon: '🟡', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: '#d9770640' },
  { id: 'Squarespace', label: 'Squarespace', icon: '⬛', color: '#475569', bg: 'rgba(71, 85, 105, 0.12)', border: '#47556940' },
  { id: 'Magento', label: 'Magento', icon: '🟧', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)', border: '#ea580c40' },
  { id: 'BigCommerce', label: 'BigCommerce', icon: '💎', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', border: '#0284c740' },
  { id: 'HubSpot', label: 'HubSpot', icon: '🟠', color: '#ff7a59', bg: 'rgba(255, 122, 89, 0.12)', border: '#ff7a5940' },
  { id: 'Drupal', label: 'Drupal', icon: '💧', color: '#0678be', bg: 'rgba(6, 120, 190, 0.12)', border: '#0678be40' },
  { id: 'Joomla', label: 'Joomla', icon: '🇯', color: '#f44336', bg: 'rgba(244, 67, 54, 0.12)', border: '#f4433640' },
  { id: 'Ghost', label: 'Ghost', icon: '👻', color: '#15171a', bg: 'rgba(21, 23, 26, 0.12)', border: '#15171a40' },
  { id: 'Custom', label: 'Custom / Other', icon: '🌐', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', border: '#64748b40' }
];

export function getCmsBadge(cmsName) {
  if (!cmsName) return CMS_DEFINITIONS.find(c => c.id === 'Custom');
  const found = CMS_DEFINITIONS.find(c => c.id.toLowerCase() === cmsName.toLowerCase() || c.label.toLowerCase() === cmsName.toLowerCase());
  return found || {
    id: cmsName,
    label: cmsName,
    icon: '🌐',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: '#64748b40'
  };
}
