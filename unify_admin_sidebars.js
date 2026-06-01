const fs = require("fs");
const path = require("path");

const sidebarHTML = `
        <aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 dark:bg-[#0d1117] border-r border-slate-800/60 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 flex flex-col">
            <div class="h-16 flex items-center justify-between px-5 border-b border-slate-800/60">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <i data-lucide="shield-check" class="w-4 h-4 text-white"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-white text-sm leading-none">OIT_STACK</h1>
                        <p class="text-[10px] text-slate-500 font-medium mt-0.5">Admin Portal</p>
                    </div>
                </div>
            </div>
            
            <nav class="flex-1 py-3 px-3 overflow-y-auto space-y-0.5">
                <a href="/" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 group">
                    <i data-lucide="home" class="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-300"></i> Home
                </a>
                <a href="admin-dashboard.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 shrink-0"></i> Dashboard
                </a>
                <a href="admin-students.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="users" class="w-4 h-4 shrink-0"></i> Students
                </a>
                <a href="admin-categories.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="folder-tree" class="w-4 h-4 shrink-0"></i> Categories
                </a>
                <a href="admin-questions.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="database" class="w-4 h-4 shrink-0"></i> Question Pool
                </a>
                <a href="admin-tests.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="file-text" class="w-4 h-4 shrink-0"></i> Tests
                </a>
                <a href="admin-coding.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="code" class="w-4 h-4 shrink-0"></i> Coding Challenges
                </a>
                <a href="admin-results.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="award" class="w-4 h-4 shrink-0"></i> Results
                </a>
                <a href="admin-analytics.html" class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200">
                    <i data-lucide="bar-chart-3" class="w-4 h-4 shrink-0"></i> Analytics
                </a>
            </nav>
            <div class="p-3 border-t border-slate-800/60">
                <button onclick="logout()" class="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-slate-400 hover:text-rose-400 transition-colors">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    <span class="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Overlay for mobile sidebar -->
        <div id="sidebarOverlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 hidden lg:hidden"></div>
`;

const headerHTML = `
        <!-- Main Content -->
        <div class="flex-1 lg:ml-64 flex flex-col min-w-0 h-full">
            <header class="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
                <div class="flex items-center gap-3">
                    <button onclick="toggleSidebar()" class="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                        <i data-lucide="menu" class="w-5 h-5 text-slate-600 dark:text-slate-400"></i>
                    </button>
                    <h2 class="font-bold text-lg hidden sm:block">Admin Portal</h2>
                </div>
                <div class="flex items-center gap-2">
                    <a href="/" class="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mr-2">Home</a>
                    <button onclick="toggleTheme()" class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <i data-lucide="moon" class="w-4 h-4 dark:hidden"></i>
                        <i data-lucide="sun" class="w-4 h-4 hidden dark:block"></i>
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/50 dark:bg-[#0a0f1e]/50">
`;

const dir = "CorporateTraining/frontend";
const files = fs.readdirSync(dir).filter(f => f.startsWith("admin-") && f.endsWith(".html"));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  let newContent = content;

  // Replace everything between <body ...> and the main content wrapper
  newContent = newContent.replace(/<body[^>]*>[\s\S]*?(<div[^>]*max-w-[\w]+ mx-auto[^>]*>|<div[^>]*max-w-6xl mx-auto[^>]*>|<div[^>]*p-6 lg:p-8[^>]*>|<h1 class="text-2xl font-black)/i, `<body class="bg-slate-50 dark:bg-[#0a0f1e] text-slate-900 dark:text-white font-sans overflow-hidden">\n    <div class="flex h-screen">\n${sidebarHTML}${headerHTML}\n                $1`);
  
  newContent = newContent.replace(/(<script[^>]*src="api\.js"[^>]*><\/script>[\s\S]*?<script)/i, `            </main>\n        </div>\n    </div>\n\n    $1`);
  // If it didn't find the api script context, just do it before the last script:
  if(newContent === content) {
       newContent = newContent.replace(/(<script)/, `            </main>\n        </div>\n    </div>\n\n    $1`);
  }

  // Cleanup old closures
  newContent = newContent.replace(/<\/main>[\s]*<\/div>[\s]*<\/div>[\s]*<\/div>[\s]*(<script)/i, `$1`);
  newContent = newContent.replace(/<\/div>[\s]*<\/div>[\s]*(<script)/i, `$1`);

  // Inject js functions if not present
  if (!newContent.includes("function toggleSidebar()")) {
    newContent = newContent.replace(/(lucide\.createIcons\(\);)/, `$1\n\n        function toggleSidebar() {\n            document.getElementById('sidebar').classList.toggle('-translate-x-full');\n            const overlay = document.getElementById('sidebarOverlay');\n            if(overlay) overlay.classList.toggle('hidden');\n        }\n\n        function logout() {\n            api.removeToken();\n            window.location.href = 'login.html';\n        }\n\n        // Highlight active link\n        document.addEventListener('DOMContentLoaded', () => {\n            const currentPath = window.location.pathname.split('/').pop();\n            document.querySelectorAll('.nav-link').forEach(link => {\n                if(link.getAttribute('href') === currentPath) {\n                    link.classList.remove('text-slate-400');\n                    link.classList.add('bg-indigo-500/15', 'text-indigo-400', 'border', 'border-indigo-500/20');\n                    const icon = link.querySelector('i');\n                    if(icon) { icon.classList.remove('text-slate-500'); icon.classList.add('text-indigo-400'); }\n                }\n            });\n        });`);
  }

  // Clear remnants
  newContent = newContent.replace(/<nav class="h-16[^>]*>[\s\S]*?<\/nav>/gi, "");
  newContent = newContent.replace(/<div id="sidebar" class="w-64 bg-white[^>]*>[\s\S]*?<\/div>[\s]*<\/div>[\s]*<\/div>/i, "");
  newContent = newContent.replace(/<div id="sidebar" class="w-64 bg-white[^>]*>[\s\S]*?<\/div>/i, "");
  
  // Cleanup duplicates from the dynamic wrapper injection if they already existed
  // Wait, if it already had the wrappers, we don't want double wrappers. Let's just write and check.
  
  fs.writeFileSync(filePath, newContent);
  console.log("Updated", file);
}
