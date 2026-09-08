#!/usr/bin/env node
// Aggressively adds `import Foundation` / `import UIKit` to Expo modules-core
// Swift files that lack any import statement. This ensures Xcode's standalone
// indexer can resolve types when these files are opened outside the Pod target
// context.
//
// UIKit is added when the file references any `UI*` or SwiftUI type, or when
// the file is in a Views/SwiftUI/AppDelegates/etc. directory. Foundation is
// always added (it's needed for NSError, URL, CharacterSet, etc.).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'node_modules', 'expo-modules-core', 'ios');

// Always add Foundation. Add UIKit when UI* / SwiftUI types are referenced,
// OR when the file is in a clearly UI directory.
const UI_PATH_HINT = /(\/|^)(Views|AppDelegates|ReactDelegates|DevTools|Platform|SwiftUI|UIKit)\//;

function needsUIKit(text, relPath) {
  if (UI_PATH_HINT.test(relPath)) return true;
  return /\b(UI[A-Z][a-zA-Z]*|UIKit|SwiftUI|ObservableObject|CGRect|CGPoint|CGSize|CGFloat|NSLayoutConstraint|UIResponder|UIEvent|UIScene|UIScreen|UIDevice|UIPress|UITouch|UIGestureRecognizer|UIWindow|UIColor|UIFont|UIImage|UIViewController|UIView|UILabel|UIButton|UIScrollView|UITableView|UICollectionView)\b/.test(text);
}

function needsFoundation(text) {
  return /\b(NSError|NSString|NSURL|NSData|NSArray|NSDictionary|NSNumber|NSValue|NSObject|NSException|NSSet|NSDate|NSIndexSet|NSCharacterSet|NSURLRequest|NSURLSession|NSURLComponents|CharacterSet|UserDefaults|FileManager|FileHandle|NotificationCenter|DispatchQueue|DispatchTimeInterval|TimeInterval|UUID|CodingKeys|URLSession|URLRequest|URLResponse|URLComponents|URLQueryItem|HTTPURLResponse|NSCoding|NSCopying|NSZone|NSRecursiveLock|NSCondition|NSLock|NSMutableArray|NSMutableDictionary|NSMutableSet|NSMutableString|NSMutableData|NSPredicate|NSSortDescriptor|Formatter|ByteCountFormatter|DateFormatter|NumberFormatter|RelativeDateTimeFormatter|ISO8601DateFormatter|Measurement|UnitLength|UnitMass|UnitTemperature|UnitSpeed|ProcessInfo|URL\(|URL\.|Date\(|Date\.|Locale|Calendar|TimeZone|IndexPath|IndexSet|URL\?|URL!\b|UUID\(|UUID\.)\b/.test(text);
}

function processFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(ROOT, filePath);
  const lines = text.split('\n');

  // Skip if it already has any `import` statement within first 20 lines.
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    if (/^import\s/.test(lines[i].trim())) return false;
  }

  const wantUIKit = needsUIKit(text, rel);
  const wantFoundation = needsFoundation(text);
  if (!wantUIKit && !wantFoundation) return false;

  // Find insertion point: after any leading doc/copyright block (// ... /\n ...).
  let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (l === '') { i++; continue; }
    if (l.startsWith('//')) { i++; continue; }
    if (l.startsWith('/*')) {
      while (i < lines.length && !lines[i].includes('*/')) i++;
      i++; // past closing */
      continue;
    }
    break;
  }

  const imports = [];
  if (wantUIKit) imports.push('import UIKit');
  if (wantFoundation) imports.push('import Foundation');

  const newLines = [
    ...lines.slice(0, i),
    '',
    ...imports,
    '',
    ...lines.slice(i),
  ];
  fs.writeFileSync(filePath, newLines.join('\n'));
  return true;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'Tests' || entry.name === 'node_modules') continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.swift')) {
      if (processFile(full)) {
        console.log('patched:', path.relative(ROOT, full));
      }
    }
  }
}

walk(ROOT);
console.log('done');
