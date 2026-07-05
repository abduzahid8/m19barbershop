# M19 Barbershop Long-Term Memory

## Project Overview
- **Name**: M19 Barbershop React Native (Expo) app.
- **Goal**: Online booking system for a premium barber shop in Tashkent.
- **Design System**: Luxury club style with obsidian-matte tones (`#09090B`), metallic gold gradients (`#AA7C11` to `#D4AF37`), glowing selectors, and glassmorphism.

## Architecture Decisions
- **Animations**: Standard React Native `Animated` API is used exclusively across all components to ensure cross-platform rendering safety and prevent bundle/plugin compilation errors that may occur with Reanimated packages in Jest testing.
- **Flow Control**: Booking wizard transitions use synchronous state updates in conjunction with quick animation value triggers to keep testing framework selectors aligned instantly.
