#!/usr/bin/env python3
"""Final fix: ensure ALL Swift files in expo-modules-core/ios (except Tests)
have `import Foundation` and `import UIKit` (where applicable) at the top.
This is the catch-all pass that handles files where the original patch missed."""
import os
import re

ROOT = "/Users/v.zahid/startups/m19barbershop/node_modules/expo-modules-core/ios"

UI_HINT = re.compile(r'/ios/(Core/Views|AppDelegates|ReactDelegates|DevTools|Platform|Fabric)/|SwiftUI')
NEEDS_UIKIT_TEXT = re.compile(r'\b(UI[A-Z][a-zA-Z]*|UIKit|SwiftUI|ObservableObject|CGRect|CGPoint|CGSize|CGFloat|NSLayoutConstraint|UIResponder|UIEvent|UIScene|UIScreen|UIDevice|UIPress|UITouch|UIGestureRecognizer|UIWindow|UIColor|UIFont|UIImage|UIViewController|UIView|UILabel|UIButton|UIScrollView|UITableView|UICollectionView|UIBezierPath|UIPanGestureRecognizer|UIPinchGestureRecognizer|UISwipeGestureRecognizer|UIRotationGestureRecognizer|UITapGestureRecognizer|UILongPressGestureRecognizer|UIRectEdge|UIBlurEffect|UIVisualEffectView)\b')


def ensure_imports(path):
    with open(path) as f:
        text = f.read()

    # If file already has `import Foundation` and (optionally) `import UIKit`,
    # skip. Otherwise, add what's missing.
    has_foundation = bool(re.search(r'^import\s+Foundation\b', text, re.M))
    rel = os.path.relpath(path, ROOT)
    needs_uikit = bool(UI_HINT.search(path)) or bool(NEEDS_UIKIT_TEXT.search(text))
    has_uikit = bool(re.search(r'^import\s+UIKit\b', text, re.M))

    new_imports = []
    if needs_uikit and not has_uikit:
        new_imports.append('import UIKit')
    if not has_foundation:
        new_imports.append('import Foundation')
    if not new_imports:
        return False

    # Prepend new imports to the file.
    new_text = '\n'.join(new_imports) + '\n\n' + text
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
            if ensure_imports(full):
                fixed.append(os.path.relpath(full, ROOT))
    return fixed


fixed = walk(ROOT)
for f in fixed:
    print('ensured:', f)
print('total:', len(fixed))
