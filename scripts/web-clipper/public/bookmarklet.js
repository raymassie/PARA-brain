// This function is serialized into the bookmark URL by the local helper.
export function capturePage(helperOrigin) {
  if (!/^https?:$/.test(location.protocol)) {
    alert('PARA Clipper works on web pages. For a PDF or browser page, paste text into the clipper.');
    return;
  }
  const selection = window.getSelection();
  const selected = document.createElement('div');
  if (selection && !selection.isCollapsed) {
    for (let i = 0; i < selection.rangeCount; i++) selected.append(selection.getRangeAt(i).cloneContents());
  }
  const doc = document.documentElement.cloneNode(true);
  // Avoid copying scripts, form values, or executable attributes from the page.
  for (const root of [doc, selected]) {
    root.querySelectorAll('script:not([type="application/ld+json"]),style,iframe,object,embed,input,textarea,select,button').forEach(el => el.remove());
    for (const el of root.querySelectorAll('*')) {
      for (const attr of [...el.attributes]) {
        if (/^on/i.test(attr.name) || ['srcdoc', 'style'].includes(attr.name)) el.removeAttribute(attr.name);
      }
      for (const attr of ['href', 'src', 'poster']) {
        const value = el.getAttribute(attr);
        if (value) { try { el.setAttribute(attr, new URL(value, document.baseURI).href); } catch {} }
      }
    }
  }
  const payload = JSON.stringify({ url: location.href, title: document.title,
    html: doc.outerHTML, selection: selected.innerHTML });
  if (new Blob([payload]).size > 8 * 1024 * 1024) {
    alert('This page is too large. Copy the passage and paste it into PARA Clipper.'); return;
  }
  // A local form POST keeps page content out of URLs, history entries, and logs.
  // This opens the preview in the same tab; Back returns to the source page.
  const form = document.createElement('form');
  form.method = 'POST'; form.action = `${helperOrigin}/capture`; form.hidden = true;
  const field = document.createElement('input');
  field.type = 'hidden'; field.name = 'capture'; field.value = payload;
  form.append(field); document.body.append(form); form.submit();
}

export function bookmarklet(origin) {
  const code = `(${capturePage.toString()})(${JSON.stringify(origin)})`;
  return `javascript:${encodeURIComponent(`void ${code}`)}`;
}
