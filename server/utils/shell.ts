import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Resolves the appropriate shell for the current platform
 * 
 * Best Practices Applied:
 * - Cross-platform support (Windows, Linux, Termux)
 * - Priority-based shell selection
 * - Fallback to default shells
 * - Environment variable support
 */
export function resolveShell(): string {
  if (process.platform === 'win32') {
    // Windows: Try Git Bash first, then WSL, then cmd.exe
    const gitBashPaths = [
      process.env.GIT_BASH,
      'C:\\Program Files\\Git\\bin\\bash.exe',
      'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
      resolve(process.env.PROGRAMFILES || 'C:\\Program Files', 'Git', 'bin', 'bash.exe'),
      resolve(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Git', 'bin', 'bash.exe')
    ].filter(Boolean);

    for (const gitBash of gitBashPaths) {
      if (existsSync(gitBash)) {
        return gitBash;
      }
    }

    // Try WSL
    const wslPath = 'wsl.exe';
    if (existsSync(wslPath)) {
      return wslPath;
    }

    // Fallback to cmd.exe
    return process.env.COMSPEC || 'cmd.exe';
  }

  // Linux/Termux: Try various shell locations
  const candidates = [
    process.env.SHELL || '',
    process.env.PREFIX ? `${process.env.PREFIX}/bin/bash` : '',
    '/data/data/com.termux/files/usr/bin/bash',
    '/usr/bin/bash',
    '/bin/bash',
    process.env.PREFIX ? `${process.env.PREFIX}/bin/sh` : '',
    '/data/data/com.termux/files/usr/bin/sh',
    '/usr/bin/sh',
    '/bin/sh',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return 'sh';
}

/**
 * Resolves the path to bash executable
 */
function resolveBash(): string | null {
  if (process.platform === 'win32') return null;

  const candidates = [
    process.env.PREFIX ? `${process.env.PREFIX}/bin/bash` : '',
    '/data/data/com.termux/files/usr/bin/bash',
    '/usr/bin/bash',
    '/bin/bash',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

/**
 * Resolves the path to script command
 */
export function resolveScriptCommand(): string | null {
  if (process.platform === 'win32') return null;

  const candidates = [
    process.env.PREFIX ? `${process.env.PREFIX}/bin/script` : '',
    '/data/data/com.termux/files/usr/bin/script',
    '/usr/bin/script',
    '/bin/script',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

/**
 * Resolves the interactive shell launch configuration
 * 
 * Returns the command and arguments for launching an interactive shell
 * with proper RC file support on Unix-like systems
 */
export function resolveInteractiveShellLaunch(rcFile?: string): { command: string; args: string[] } {
  if (process.platform === 'win32') {
    const shell = resolveShell();
    return { command: shell, args: [] };
  }

  const shell = rcFile ? (resolveBash() || resolveShell()) : resolveShell();
  const isBash = /(^|\/)bash$/.test(shell);
  const shellArgs = isBash && rcFile
    ? ['--noprofile', '--rcfile', rcFile, '-i']
    : ['-i'];

  const script = resolveScriptCommand();
  if (script) {
    return {
      command: script,
      args: ['-q', '-f', '/dev/null', '--', shell, ...shellArgs],
    };
  }

  return { command: shell, args: shellArgs };
}

/**
 * Resolves the default shell command for script execution
 * 
 * On Windows with cmd.exe, returns the shell path
 * On Unix-like systems, returns the shell path
 */
export function resolveDefaultShell(): string {
  return resolveShell();
}
