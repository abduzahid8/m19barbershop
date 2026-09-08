#!/usr/bin/env python3
"""Move all `import` statements to the absolute top of each Swift file."""
import os
import re

ROOT = "/Users/v.zahid/startups/m19barbershop/node_modules/expo-modules-core/ios"


def fix_file(path):
    with open(path) as f:
        text = f.read()
    lines = text.split('\n')

    imports = []
    others = []
    for line in lines:
        if re.match(r'^import\s+\S+', line):
            imports.append(line)
        else:
            others.append(line)

    if not imports:
        return False

    # Dedupe imports while preserving order.
    seen = set()
    final_imports = []
    for imp in imports:
        s = imp.strip()
        if s not in seen:
            seen.add(s)
            final_imports.append(imp)

    # Build new content: imports first, blank line, rest of body.
    # Skip leading blank lines from body.
    body = others
    while body and body[0].strip() == '':
        body = body[1:]

    new_text = '\n'.join(final_imports) + '\n\n' + '\n'.join(body) + '\n'
    with open(path, 'w') as f:
        f.write(new_text)
    return True


def walk(dir):
    fixed = []
    for entry in sorted(os.listdir(dir)):
        full = os.path.join(dir, entry)
        if os.path.isdir(full):
            if entry in ('Tests', 'node_modules'):
                continue
            fixed.extend(walk(full))
        elif entry.endswith('.swift'):
            if fix_file(full):
                fixed.append(os.path.relpath(full, ROOT))
    return fixed


fixed = walk(ROOT)
for f in fixed:
    print('fixed:', f)
print('total:', len(fixed))
