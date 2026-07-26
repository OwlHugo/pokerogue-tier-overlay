const STYLE = [
  'position:fixed',
  'top:8px',
  'left:8px',
  'z-index:2147483647',
  'pointer-events:none',
  'padding:6px 10px',
  'border-radius:4px',
  'background:#b91c1c',
  'color:#fff',
  'font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace',
].join(';');

export function reportFailure(message: string): void {
  const banner = document.createElement('div');
  banner.style.cssText = STYLE;
  banner.textContent = message;
  document.body.appendChild(banner);
}
