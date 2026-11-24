const PortfolioEdits = (() => {
  const storageKey = 'harsh_portfolio_data';

  function webAddress(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  }

  function apply(root, data) {
    const field = (key) => typeof data[key] === 'string' ? data[key].trim() : '';
    root.querySelectorAll('[data-edit]').forEach((element) => {
      const { edit } = element.dataset;
      const value = field(edit);
      if (!value) return;
      element.textContent = ['statProjects', 'statTech'].includes(edit) && /^\d+$/.test(value) ? `${value}+` : value;
      const optional = element.closest('[data-optional]');
      if (optional) optional.hidden = false;
    });

    root.querySelectorAll('[data-link]').forEach((element) => {
      const { link } = element.dataset;
      const value = field(link);
      const digits = value.replace(/[^0-9]/g, '');
      let address = webAddress(value);
      if (link === 'email') address = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value) ? `mailto:${value}` : '';
      if (link === 'phone') address = digits ? `tel:${value.startsWith('+') ? '+' : ''}${digits}` : '';
      if (!address) return;
      element.setAttribute('href', address);
      element.hidden = false;
      root.querySelectorAll(`[data-fallback="${link}"]`).forEach((fallback) => { fallback.hidden = true; });
    });

    const whatsapp = field('whatsappNumber').replace(/[^0-9]/g, '');
    if (whatsapp) root.querySelectorAll('[data-whatsapp]').forEach((element) => {
      element.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(element.dataset.whatsapp)}`;
    });

    function setMeta(attribute, key, value) {
      if (!value) return;
      const meta = root.querySelector(`meta[${attribute}="${key}"]`) || root.createElement('meta');
      meta.setAttribute(attribute, key);
      meta.content = value;
      if (!meta.parentNode) root.head.append(meta);
    }

    const title = field('seoTitle');
    const description = field('seoDescription');
    const canonical = webAddress(field('portfolioUrl'));
    const preview = webAddress(field('previewImage'));
    if (title) root.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
    if (canonical) root.querySelector('link[rel="canonical"]').href = canonical;
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', preview);
    setMeta('name', 'twitter:image', preview);
    if (preview) setMeta('name', 'twitter:card', 'summary_large_image');
  }

  return { apply, read, storageKey };
})();
