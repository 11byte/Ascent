// Simple UI overlay
export function showDialog(title, body) {
  const dlg = document.createElement("div");
  dlg.style.position = "fixed";
  dlg.style.left = "50%";
  dlg.style.top = "20%";
  dlg.style.transform = "translateX(-50%)";
  dlg.style.zIndex = "10000";
  dlg.style.minWidth = "300px";
  dlg.style.background = "white";
  dlg.style.padding = "18px";
  dlg.style.borderRadius = "10px";
  dlg.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
  dlg.innerHTML = `<h3 style="margin:0 0 8px 0">${title}</h3>
                   <div style="margin-bottom:12px">${body}</div>
                   <div style="text-align:right"><button id="dlg-close">Close</button></div>`;
  document.body.appendChild(dlg);
  const btn = document.getElementById("dlg-close");
  btn?.addEventListener("click", () => dlg.remove());
}
