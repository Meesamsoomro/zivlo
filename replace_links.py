import os
import re

pages_dir = '/Users/mac/Documents/Zivlo/app/(pages)'

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Regex to find <button onClick={() => router.push('path')} ...> ... </button>
    # and replace with <Link href="path" ...> ... </Link>
    # Note: We need to handle single quotes, double quotes, and backticks.
    
    # We will do a generic approach:
    # Find all onClick={() => router.push("path")} or ('path')
    # but some have variables: `onClick={() => router.push('/results?search_id=' + item.id)}`
    
    # It's safer to just run an interactive AST or just a simple regex for the simple ones:
    
    pattern_button_open = re.compile(r'<button\s+([^>]*?)onClick=\{\(\) => router\.push\(([\'"])(.*?)([\'"])\)\}([^>]*?)>')
    
    def replacer(match):
        before_onclick = match.group(1)
        path = match.group(3)
        after_onclick = match.group(5)
        return f'<Link\n          href="{path}"\n          {before_onclick.strip()} {after_onclick.strip()}>'.replace('  >', '>')
        
    new_content, count = pattern_button_open.subn(replacer, content)
    
    if count > 0:
        # Also need to replace </button> with </Link> for those specific ones?
        # Actually it's easier to just match the entire button block if possible, but regex for nested HTML is hard.
        pass

    # Actually, let's just do simple string replacements for the specific ones I found:
    replacements = [
        # appscreen/page.tsx
        (
            """<button
              onClick={() => router.push('/dashboard')}
              className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition shadow-sm shrink-0 mt-2 sm:mt-0"
            >
              Fix now
            </button>""",
            """<Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition shadow-sm shrink-0 mt-2 sm:mt-0 inline-block"
            >
              Fix now
            </Link>"""
        ),
        (
            """<button
              onClick={() => router.push('/dashboard')}
              className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition shadow-sm shrink-0 mt-2 sm:mt-0"
            >
              Fix now
            </button>""",
            """<Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition shadow-sm shrink-0 mt-2 sm:mt-0 inline-block"
            >
              Fix now
            </Link>"""
        ),
        # dashboard/page.tsx
        (
            """<button onClick={() => router.push('/appscreen')} className="underline" style={{ color: navy }}>Run your first search →</button>""",
            """<Link href="/appscreen" className="underline" style={{ color: navy }}>Run your first search →</Link>"""
        ),
        (
            """<button
                  key={item.id}
                  onClick={() => router.push('/results?search_id=' + item.id)}
                  className="w-full bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 flex items-center justify-between transition text-left"
                >""",
            """<Link
                  key={item.id}
                  href={'/results?search_id=' + item.id}
                  className="w-full bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 flex items-center justify-between transition text-left block"
                >"""
        ),
        # failure/page.tsx
        (
            """<button
          onClick={() => router.push('/dashboard')}
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap flex items-center gap-2"
          style={{ backgroundColor: navy }}
        >""",
            """<Link
          href="/dashboard"
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap flex items-center gap-2"
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
        # forgot-password/page.tsx
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
        # homepage/page.tsx
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
              className="text-sm md:text-base text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold transition shadow-md whitespace-nowrap"
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
        # legal/page.tsx
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
        # paywall/page.tsx
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
            className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
            style={{ backgroundColor: navy }}
          >
            Dashboard
          </Link>"""
        ),
        # reset-password/page.tsx
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
        # results/page.tsx
        (
            """<button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 rounded-lg font-semibold text-white transition hover:opacity-90 w-full"
              style={{ backgroundColor: navy }}
            >
              Go to Dashboard
            </button>""",
            """<Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-lg font-semibold text-white transition hover:opacity-90 w-full block text-center"
              style={{ backgroundColor: navy }}
            >
              Go to Dashboard
            </Link>"""
        ),
        (
            """<button
            onClick={() => router.push("/appscreen")}
            className="px-6 py-3 bg-white text-slate-700 rounded-lg font-semibold border border-slate-200 hover:bg-slate-50 transition"
          >
            Run another search
          </button>""",
            """<Link
            href="/appscreen"
            className="px-6 py-3 bg-white text-slate-700 rounded-lg font-semibold border border-slate-200 hover:bg-slate-50 transition inline-block"
          >
            Run another search
          </Link>"""
        ),
        # success/page.tsx
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
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
          style={{ backgroundColor: navy }}
        >
          Dashboard
        </Link>"""
        )
    ]
    
    modified = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    # Check for <Logo onClick={() => router.push(...)} />
    if '<Logo onClick={() => router.push(' in content:
        content = re.sub(r'<Logo onClick=\{\(\) => router\.push\([\'"](.*?)[\'"]\)\} />', r'<Link href="\1"><Logo /></Link>', content)
        modified = True
        
    # Ensure Link is imported if it was modified
    if modified and 'import Link from "next/link"' not in content and "import Link from 'next/link'" not in content:
        # Find last import
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
