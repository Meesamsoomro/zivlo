import os
import re

pages_dir = '/Users/mac/Documents/Zivlo/app/(pages)'

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    modified = False

    # Regex to find <button ... onClick={() => router.push("path")} ...> ... </button>
    # and replace with <Link href="path" ...> ... </Link>
    # Note: re.DOTALL allows dot to match newlines
    
    def replacer(match):
        before = match.group(1)
        path = match.group(3)
        after = match.group(5)
        
        # If the path has + or variables, wrap it in braces
        if '+' in path or '?' in path and not path.startswith(('"', "'", '`')):
            if not path.startswith(('"', "'", '`')):
                if '+' in path:
                    pass # handled by AST ideally, but let's just use {}
        
        if path.startswith('"') or path.startswith("'") or path.startswith("`"):
            href = f'href={path}'
        elif "'" in path or '"' in path:
            href = f'href={{{path}}}' # dynamic
        else:
            href = f'href="{path}"'
            
        return f'<Link\n{before} {href} {after}'.replace('\n ', '\n').replace(' \n', '\n')

    # This regex is highly generic and might fail on nested buttons.
    # Let's do specific search and replaces for the exact lines outputted by grep.
    
    # 1. appscreen/page.tsx
    # onClick={() => router.push('/dashboard')}
    
    # Let's just use regex line-by-line or block-by-block.
    import ast
    
    # We will just write out the exact replacements needed for the remaining ones.
    
    replacements = [
        # failure/page.tsx
        (
            """<button
          onClick={() => router.push('/dashboard')}
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
          style={{ backgroundColor: navy }}
        >""",
            """<Link
          href="/dashboard"
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap inline-block"
          style={{ backgroundColor: navy }}
        >"""
        ),
        (
            """<button
              onClick={() => router.push('/paywall')}
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 w-full"
              style={{ backgroundColor: navy }}
            >
              Return to pricing
            </button>""",
            """<Link
              href="/paywall"
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 w-full block text-center"
              style={{ backgroundColor: navy }}
            >
              Return to pricing
            </Link>"""
        ),
        # forgot-password
        (
            """<button
          onClick={() => router.push("/login")}
          className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition"
        >""",
            """<Link
          href="/login"
          className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition inline-block"
        >"""
        ),
        (
            """<button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-4 rounded-lg font-semibold transition border-2 hover:bg-slate-50"
                style={{ borderColor: navy, color: navy }}
              >
                Back to login
              </button>""",
            """<Link
                href="/login"
                className="w-full py-4 rounded-lg font-semibold transition border-2 hover:bg-slate-50 block text-center"
                style={{ borderColor: navy, color: navy }}
              >
                Back to login
              </Link>"""
        ),
        # homepage
        (
            """<button
              onClick={() => router.push("/dashboard")}
              className="text-sm md:text-base text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold transition shadow-md whitespace-nowrap"
              style={{ backgroundColor: navy }}
            >
              Dashboard
            </button>""",
            """<Link
              href="/dashboard"
              className="text-sm md:text-base text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold transition shadow-md whitespace-nowrap inline-block"
              style={{ backgroundColor: navy }}
            >
              Dashboard
            </Link>"""
        ),
        (
            """<button
                onClick={() => router.push("/login")}
                className="text-sm font-medium hover:opacity-70 transition hidden md:block"
                style={{ color: navy }}
              >
                Log in
              </button>""",
            """<Link
                href="/login"
                className="text-sm font-medium hover:opacity-70 transition hidden md:block"
                style={{ color: navy }}
              >
                Log in
              </Link>"""
        ),
        (
            """<button
                onClick={() => router.push("/signup")}
                className="text-sm md:text-base text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold transition shadow-md whitespace-nowrap"
                style={{ backgroundColor: navy }}
              >
                Start free trial
              </button>""",
            """<Link
                href="/signup"
                className="text-sm md:text-base text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold transition shadow-md whitespace-nowrap inline-block"
                style={{ backgroundColor: navy }}
              >
                Start free trial
              </Link>"""
        ),
        (
            """<button
              onClick={() => router.push("/signup")}
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Sign up
            </button>""",
            """<Link
              href="/signup"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Sign up
            </Link>"""
        ),
        (
            """<button
            onClick={() => router.push("/signup")}
            className="w-full sm:w-auto text-base md:text-lg text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1"
            style={{ backgroundColor: gold, color: navy }}
          >
            Start your free trial
            <ArrowRight size={20} />
          </button>""",
            """<Link
            href="/signup"
            className="w-full sm:w-auto text-base md:text-lg text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1 inline-flex"
            style={{ backgroundColor: gold, color: navy }}
          >
            Start your free trial
            <ArrowRight size={20} />
          </Link>"""
        ),
        # legal
        (
            """<button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition whitespace-nowrap mt-4 md:mt-0"
          style={{ color: navy }}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to home</span>
        </button>""",
            """<Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition whitespace-nowrap mt-4 md:mt-0"
          style={{ color: navy }}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to home</span>
        </Link>"""
        ),
        # paywall
        (
            """<button
            onClick={() => router.push('/dashboard')}
            className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
            style={{ backgroundColor: navy }}
          >
            Dashboard
          </button>""",
            """<Link
            href="/dashboard"
            className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap inline-block"
            style={{ backgroundColor: navy }}
          >
            Dashboard
          </Link>"""
        ),
        # reset-password
        (
            """<button
          onClick={() => router.push("/login")}
          className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition"
        >
          Remember your password?{" "}
          <span className="font-semibold" style={{ color: navy }}>
            Log in
          </span>
        </button>""",
            """<Link
          href="/login"
          className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition"
        >
          Remember your password?{" "}
          <span className="font-semibold" style={{ color: navy }}>
            Log in
          </span>
        </Link>"""
        ),
        # results
        (
            """<button
            onClick={() => router.push("/appscreen")}
            className="px-6 py-3 bg-white text-slate-700 rounded-lg font-semibold border border-slate-200 hover:bg-slate-50 transition"
          >
            Run another search
          </button>""",
            """<Link
            href="/appscreen"
            className="px-6 py-3 bg-white text-slate-700 rounded-lg font-semibold border border-slate-200 hover:bg-slate-50 transition inline-block text-center"
          >
            Run another search
          </Link>"""
        ),
        # success
        (
            """<button
          onClick={() => router.push('/dashboard')}
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
          style={{ backgroundColor: navy }}
        >
          Dashboard
        </button>""",
            """<Link
          href="/dashboard"
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap inline-block"
          style={{ backgroundColor: navy }}
        >
          Dashboard
        </Link>"""
        )
    ]
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    # Auto replace the <button onClick={() => router.push(...)
    # that are not multiline:
    content = re.sub(r'<button onClick=\{\(\) => router\.push\([\'"](.*?)[\'"]\)\} className="underline" style={{ color: navy }}>Run your first search →</button>',
           r'<Link href="\1" className="underline" style={{ color: navy }}>Run your first search →</Link>', content)

    # Check for <Logo onClick={() => router.push(...)} />
    if '<Logo onClick={() => router.push(' in content:
        content = re.sub(r'<Logo onClick=\{\(\) => router\.push\([\'"](.*?)[\'"]\)\} />', r'<Link href="\1"><Logo /></Link>', content)
        modified = True
        
    if modified and 'import Link from "next/link"' not in content and "import Link from 'next/link'" not in content:
        import_match = list(re.finditer(r'^import .*;\n', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            content = content[:last_import.end()] + 'import Link from "next/link";\n' + content[last_import.end():]
            
    if modified:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(pages_dir):
    for f in files:
        if f.endswith('.tsx'):
            replace_in_file(os.path.join(root, f))
