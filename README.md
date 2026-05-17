<p align="center">
  <img src="./assets/banner.png" width="100%">
</p>

<h1 align="center">ReVanced CLI</h1>

<p align="center">
  Material 3 Expressive Windows frontend for ReVanced CLI with native PowerShell patch execution.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows%2010%20%2F%2011-0078D6?style=for-the-badge">
  <img src="https://img.shields.io/badge/framework-Tauri-8B5CF6?style=for-the-badge">
  <img src="https://img.shields.io/badge/frontend-Next.js-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/design-Material%203%20Expressive-84CC16?style=for-the-badge">
  <img src="https://img.shields.io/badge/license-MIT-F97316?style=for-the-badge">
</p>

---

# ReVanced CLI

ReVanced CLI is a modern desktop frontend built for Android enthusiasts and power users who prefer the flexibility of the official ReVanced CLI workflow without sacrificing usability.

The project combines:
- native desktop performance
- real PowerShell execution
- Material 3 Expressive design
- live patch logging
- responsive workspace management

into a clean Windows experience inspired by Google Pixel system applications and Android Studio tooling aesthetics.

Unlike simulated patching interfaces, this application executes actual ReVanced CLI commands locally on your machine while streaming real-time logs directly inside the UI.

---

# Features

- Real ReVanced CLI patch execution
- Native PowerShell integration
- Live terminal log streaming
- Material 3 Expressive desktop interface
- Dynamic wallpaper-based theming
- Supported apps compatibility catalog
- Local-only processing
- Responsive Windows desktop layout
- Modern workspace management
- Tauri-powered native runtime
- Windows 10/11 optimized experience

---

# Screenshots

## Dashboard

Modern workspace overview with build execution and module management.

![Dashboard](./assets/dashboard.png)

---

## Supported Applications

Live compatibility catalog synchronized from ReVanced patch bundles.

![Supported Apps](./assets/supported-apps.png)

---

## Theme Configuration

Material 3 inspired personalization and dynamic styling controls.

![Theme Settings](./assets/settings-theme.png)

---

## Wallpaper & Dynamic Colors

Wallpaper-based tonal extraction inspired by Android 14 and Pixel UI.

![Wallpaper Settings](./assets/settings-wallpaper.png)

---

# Real CLI Execution

The application acts as a native desktop wrapper around the official ReVanced CLI workflow.

Users provide:

- `revanced-cli.jar`
- `patches.rvp`
- `input.apk`

The application executes:

```powershell
java -jar revanced-cli.jar patch -p patches.rvp -o patched.apk input.apk
```

through PowerShell while streaming live logs directly into the desktop interface.

No fake patching.
No simulated logs.
Everything runs locally on your machine.

---

# Requirements

## Operating System

- Windows 10
- Windows 11

---

## Java Runtime

Java 11 or newer is required.

Download Java:

https://www.azul.com/downloads/?version=java-11-lts&package=jre#zulu

---

# Required Files

| File | Description |
|---|---|
| `revanced-cli.jar` | Official ReVanced CLI |
| `patches.rvp` | ReVanced patch bundle |
| `input.apk` | APK file to patch |

---

# Supported Applications

Supported applications are synchronized from:

https://github.com/Jman-Github/ReVanced-Patch-Bundles

The compatibility catalog updates directly from patch bundle metadata and supported application mappings.

---

# Installation

## Clone Repository

```bash
git clone https://github.com/4rjunKM/revanced-cli-desktop.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Environment

```bash
npm run tauri dev
```

---

# Build Application

```bash
npm run tauri build
```

Compiled binaries will be generated inside:

```txt
src-tauri/target/release/
```

---

# Project Structure

```txt
revanced-cli-desktop/
│
├── assets/
├── docs/
├── src/
├── src-tauri/
│
├── README.md
├── package.json
└── tauri.conf.json
```

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Tauri | Native desktop runtime |
| Next.js | Frontend framework |
| Tailwind CSS | Styling |
| TypeScript | Application logic |
| Rust | Native backend integration |
| PowerShell | Real patch execution |

---

# Design Philosophy

The interface design is heavily inspired by:

- Google Material 3 Expressive
- Android 14 / Pixel UI
- Windows 11 Fluent aesthetics
- Android Studio tooling
- Native desktop utility workflows

The goal is to provide:
- minimal distractions
- smooth interactions
- clean desktop ergonomics
- expressive personalization
- production-grade usability

while preserving the flexibility and transparency of the original CLI workflow.

---

# Developer

## Arjun KM

Engineering student focused on robotics, automation, desktop tooling, and Android ecosystem customization.

- GitHub: https://github.com/4rjunKM
- LinkedIn: https://www.linkedin.com/in/arjunkm2005

---

# Credits

- ReVanced Team
- ReVanced CLI
- ReVanced Patch Bundles
- Tauri
- Next.js

---

# Disclaimer

This project is an independent frontend utility and is not affiliated with or endorsed by the official ReVanced Team.

Users are responsible for complying with the terms and licensing of the applications they patch.

---

# License

MIT License
