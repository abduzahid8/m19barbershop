// src/utils/disableFontScaling.ts
//
// Import this ONCE, at the very top of your app's entry file (App.tsx or index.js),
// before anything else renders. It stops every <Text> and <TextInput> in the app
// from scaling up with the device's accessibility "Larger Text" / Dynamic Type
// setting, which is what was blowing up the hero title, the M19 watermark, and
// the contact card labels on your simulator (the design uses fixed pixel-perfect
// sizing, so it should not respond to system text-size settings).
//
// Usage — at the top of App.tsx:
//   import './src/utils/disableFontScaling';

import { Text, TextInput } from 'react-native';

interface ScalableDefaultProps {
  allowFontScaling?: boolean;
}

const TextAny = Text as unknown as { defaultProps?: ScalableDefaultProps };
const TextInputAny = TextInput as unknown as { defaultProps?: ScalableDefaultProps };

TextAny.defaultProps = TextAny.defaultProps || {};
TextAny.defaultProps.allowFontScaling = false;

TextInputAny.defaultProps = TextInputAny.defaultProps || {};
TextInputAny.defaultProps.allowFontScaling = false;
