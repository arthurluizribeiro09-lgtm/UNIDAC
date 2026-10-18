/* =========================================================
   Unidac Industries — app.js
   Menu e acesso por CARGO (login), estável em todas as páginas
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const ROLE_LABELS = {
  administrador: "Administrador",
  gerente: "Gerente",
  estoquista: "Estoquista",
  cozinheira: "Cozinheira",
  financeiro: "Financeiro",
  aluno: "Aluno",
  professor: "Professor",
  funcionario: "Funcionário"
};

/** Rótulos e ícones do menu (ordem visual padrão) */
const NAV_ITEMS = [
  { page: "dashboard.html", label: "Dashboard", icon: "⌂" },
  { page: "usuarios.html", label: "Usuários", icon: "👤" },
  { page: "financeiro.html", label: "Financeiro", icon: "R$" },
  { page: "estoque.html", label: "Estoque", icon: "▣" },
  { page: "cozinha.html", label: "Cozinha", icon: "♨" },
  { page: "consumo.html", label: "Consumo", icon: "◎" },
  { page: "desperdicio.html", label: "Desperdício", icon: "↘" },
  { page: "compras.html", label: "Compras", icon: "🛒" },
  { page: "validades.html", label: "Validades", icon: "⏱" },
  { page: "relatorios.html", label: "Relatórios", icon: "▥" },
  { page: "sustentabilidade.html", label: "Sustentabilidade", icon: "♻" },
  { page: "metas.html", label: "Metas", icon: "🎯" },
  { page: "inteligente.html", label: "Modo inteligente", icon: "✦" },
  { page: "cardapio.html", label: "Cardápio", icon: "🍽" },
  { page: "ficha.html", label: "Ficha", icon: "📋" },
  { page: "notificacoes.html", label: "Notificações", icon: "●" }
];

/**
 * Páginas liberadas por cargo.
 * O menu é montado a partir desta lista (não depende do HTML de cada página).
 */
const ROLE_PAGES = {
  administrador: [
    "dashboard.html", "usuarios.html", "financeiro.html", "estoque.html",
    "cozinha.html", "consumo.html", "desperdicio.html", "compras.html",
    "validades.html", "relatorios.html", "sustentabilidade.html", "metas.html",
    "inteligente.html", "cardapio.html", "ficha.html", "notificacoes.html"
  ],
  gerente: [
    "dashboard.html", "financeiro.html", "estoque.html", "cozinha.html",
    "consumo.html", "desperdicio.html", "compras.html", "validades.html",
    "relatorios.html", "sustentabilidade.html", "metas.html", "cardapio.html",
    "notificacoes.html"
  ],
  estoquista: [
    "dashboard.html", "estoque.html", "compras.html", "validades.html",
    "metas.html", "notificacoes.html"
  ],
  cozinheira: [
    "dashboard.html", "cozinha.html", "consumo.html", "estoque.html",
    "compras.html", "desperdicio.html", "validades.html", "metas.html",
    "cardapio.html", "notificacoes.html"
  ],
  financeiro: [
    "dashboard.html", "financeiro.html", "compras.html", "relatorios.html",
    "metas.html", "notificacoes.html"
  ],
  aluno: [
    "cardapio.html", "ficha.html", "metas.html", "notificacoes.html"
  ],
  professor: [
    "cardapio.html", "metas.html", "notificacoes.html"
  ],
  funcionario: [
    "cardapio.html", "metas.html", "notificacoes.html"
  ]
};

const ROLE_HOME = {
  administrador: "dashboard.html",
  gerente: "dashboard.html",
  estoquista: "dashboard.html",
  cozinheira: "dashboard.html",
  financeiro: "dashboard.html",
  aluno: "cardapio.html",
  professor: "cardapio.html",
  funcionario: "cardapio.html"
};

function getSessionLocal() {
  try {
    var u = JSON.parse(localStorage.getItem("unidacUser") || "null");
    if (u && u.role) u.role = String(u.role).trim().toLowerCase();
    return u;
  } catch (e) {
    return null;
  }
}

function currentPageName() {
  var p = (location.pathname || "").split("/").pop() || "";
  p = String(p).toLowerCase();
  if (!p || p === "/") return "index.html";
  return p;
}

function normalizePage(href) {
  if (!href) return "";
  href = String(href).split("?")[0].split("#")[0].trim();
  href = href.replace(/^\.\//, "");
  var parts = href.split("/");
  return (parts[parts.length - 1] || "").toLowerCase();
}

function pagesForRole(role) {
  role = String(role || "").toLowerCase();
  var list = ROLE_PAGES[role];
  return Array.isArray(list) ? list.slice() : [];
}

function homeForRole(role) {
  role = String(role || "").toLowerCase();
  return ROLE_HOME[role] || "dashboard.html";
}

function canAccessPage(role, page) {
  page = normalizePage(page) || String(page || "").toLowerCase();
  if (page === "index.html" || page === "preview-alertas.html" || page === "testes.html") return true;
  return pagesForRole(role).indexOf(page) !== -1;
}

function requireSession() {
  var u = typeof getSession === "function" ? getSession() : getSessionLocal();
  if (u && u.role) return u;

  var page = currentPageName();
  if (page === "index.html" || page === "" || page === "preview-alertas.html" || page === "testes.html") {
    return null;
  }

  try {
    window.location.replace("index.html");
  } catch (e) {
    window.location.href = "index.html";
  }
  return null;
}

/**
 * Monta o menu lateral só com as páginas do cargo.
 * Assim nenhuma aba “some” por HTML incompleto.
 */
function buildRoleNav(role) {
  var nav = document.querySelector("nav.nav") || document.querySelector(".nav");
  if (!nav) return;

  var allowed = pagesForRole(role);
  var allowedSet = {};
  allowed.forEach(function (p) {
    allowedSet[p] = true;
  });

  var current = currentPageName();
  var html = "";

  NAV_ITEMS.forEach(function (item) {
    if (!allowedSet[item.page]) return;
    var active = item.page === current ? " active ativo" : "";
    html +=
      '<a href="' +
      item.page +
      '" class="' +
      active.trim() +
      '">' +
      "<i>" +
      item.icon +
      "</i>" +
      "<span>" +
      item.label +
      "</span>" +
      "</a>";
  });

  // Páginas do cargo que não estão em NAV_ITEMS (segurança)
  allowed.forEach(function (page) {
    var known = NAV_ITEMS.some(function (it) {
      return it.page === page;
    });
    if (known) return;
    var active = page === current ? " active ativo" : "";
    var label = page.replace(".html", "");
    html +=
      '<a href="' +
      page +
      '" class="' +
      active.trim() +
      '"><i>•</i><span>' +
      label +
      "</span></a>";
  });

  nav.innerHTML = html;
}

function enforcePageAccess(role) {
  var page = currentPageName();
  if (canAccessPage(role, page)) return true;

  var home = homeForRole(role);
  // evita loop se home inválida
  if (!canAccessPage(role, home)) {
    var list = pagesForRole(role);
    home = list.length ? list[0] : "index.html";
  }
  if (page === home) return true;

  try {
    window.location.replace(home);
  } catch (e) {
    window.location.href = home;
  }
  return false;
}

function applyRoleAccess(role) {
  role = String(role || "").toLowerCase();
  if (!role) return false;

  buildRoleNav(role);
  return enforcePageAccess(role);
}

function showToast(msg) {
  if (typeof showUnidacAlert === "function") {
    var m = String(msg || "");
    if (/dados atualizados/i.test(m)) {
      showUnidacAlert("Dados atualizados", "success", "Sucesso", 2800);
      return;
    }
    showUnidacAlert(m);
    return;
  }
  var t = document.querySelector("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
  }, 2800);
}


/** Menu mobile: drawer + overlay + botão */
function setupMobileNav() {
  var sidebar = document.querySelector(".sidebar");
  var topbar = document.querySelector(".topbar");
  if (!sidebar) return;

  var overlay = document.querySelector(".nav-overlay");
  if (!overlay) {
    overlay = document.createElement("button");
    overlay.type = "button";
    overlay.className = "nav-overlay";
    overlay.setAttribute("aria-label", "Fechar menu");
    document.body.appendChild(overlay);
  }

  var toggle = document.querySelector(".menu-toggle");
  if (!toggle && topbar) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "menu-toggle";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "☰";
    // Insere no início da topbar
    topbar.insertBefore(toggle, topbar.firstChild);
  }
  if (!toggle) return;

  function closeNav() {
    document.body.classList.remove("nav-open");
    overlay.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    document.body.classList.add("nav-open");
    overlay.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
  }
  function toggleNav() {
    if (document.body.classList.contains("nav-open")) closeNav();
    else openNav();
  }

  toggle.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  };
  overlay.onclick = function (e) {
    e.preventDefault();
    closeNav();
  };

  // Fecha ao escolher um link do menu
  sidebar.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (a && window.matchMedia("(max-width: 900px)").matches) {
      closeNav();
    }
  });

  // Fecha com Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  // Ao redimensionar para desktop, limpa estado
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeNav();
  });
}

function setup() {
  var page = currentPageName();
  if (page === "index.html" || page === "preview-alertas.html" || page === "testes.html") {
    return;
  }

  var u = requireSession();
  if (!u) return;

  var role = String(u.role || "").toLowerCase();
  var label = ROLE_LABELS[role] || role;
  var name = u.name || label;

  if (!applyRoleAccess(role)) return;

  setupMobileNav();

  $$(".user-name").forEach(function (e) {
    e.textContent = name;
  });
  $$(".user-role").forEach(function (e) {
    e.textContent = label;
  });
  $$(".avatar").forEach(function (e) {
    e.textContent = (name || "U")[0].toUpperCase();
  });

  $$(".logout").forEach(function (b) {
    b.type = "button";
    b.onclick =
      typeof doLogout === "function"
        ? doLogout
        : function (e) {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            if (!confirm("Sair do sistema?\nSua sessão será encerrada neste dispositivo.")) return;
            localStorage.removeItem("unidacUser");
            window.location.replace("index.html");
          };
  });

  $$("[data-toast]").forEach(function (b) {
    b.onclick = function () {
      showToast(b.dataset.toast);
    };
  });

  $$(".progress i[data-width]").forEach(function (el) {
    requestAnimationFrame(function () {
      el.style.width = el.dataset.width + "%";
    });
  });
}

window.homeForRole = homeForRole;
window.pagesForRole = pagesForRole;
window.ROLE_PAGES = ROLE_PAGES;
window.ROLE_HOME = ROLE_HOME;
window.canAccessPage = canAccessPage;

document.addEventListener("DOMContentLoaded", setup);
