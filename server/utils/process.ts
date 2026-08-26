import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * Kills a process tree including all child processes
 * 
 * Best Practices Applied:
 * - Cross-platform support (Windows, Linux, macOS)
 * - Multiple fallback methods for reliability
 * - Proper error handling
 * - Uses platform-specific commands
 */
export async function killProcessTree(pid: number, signal: NodeJS.Signals = 'SIGKILL') {
  if (!pid || Number.isNaN(pid)) {
    throw new Error('Valid pid required');
  }

  if (process.platform === 'win32') {
    try {
      // Primary method: taskkill with /T (tree) and /F (force)
      await execFileAsync('taskkill', ['/PID', String(pid), '/T', '/F']);
      return;
    } catch (e) {
      // Fallback: try wmic if taskkill fails
      try {
        await execFileAsync('wmic', ['process', 'where', `pid=${pid}`, 'delete']);
        return;
      } catch (e2) {
        throw new Error(`Failed to kill process ${pid} on Windows: ${e2.message}`);
      }
    }
  }

  // Linux/macOS: Try process group kill first
  try {
    process.kill(-pid, signal);
    return;
  } catch (groupError) {
    // Fallback: kill all child processes
    try {
      await execFileAsync('pkill', ['-KILL', '-P', String(pid)]);
    } catch (_) {}

    // Final fallback: direct kill
    try {
      process.kill(pid, signal);
      return;
    } catch (directError: any) {
      throw directError || groupError;
    }
  }
}

/**
 * Checks if a process is currently alive
 * 
 * Best Practices Applied:
 * - Cross-platform support
 * - Proper error handling
 * - Returns false for non-existent processes
 */
export function isProcessAlive(pid: number): boolean {
  if (!pid || Number.isNaN(pid)) return false;

  try {
    process.kill(pid, 0);
    return true;
  } catch (error: any) {
    // EPERM means process exists but we don't have permission
    return error?.code === 'EPERM';
  }
}

/**
 * Checks if an error is due to a process not being found
 * 
 * Best Practices Applied:
 * - Cross-platform error code checking
 * - String-based error message checking
 */
export function isProcessNotFoundError(error: any): boolean {
  return error?.code === 'ESRCH' || 
         /no such process|not found/i.test(String(error?.message || error || ''));
}

/**
 * Gets all child processes of a parent process
 * 
 * Best Practices Applied:
 * - Cross-platform support
 * - Uses ps command on Unix-like systems
 * - Uses wmic on Windows
 */
export async function getChildProcesses(pid: number): Promise<number[]> {
  if (process.platform === 'win32') {
    try {
      const { stdout } = await execFileAsync('wmic', [
        'process',
        'where',
        `ParentProcessId=${pid}`,
        'get',
        'ProcessId'
      ]);
      
      const pids: number[] = [];
      const lines = stdout.trim().split('\n').slice(1); // Skip header
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          const pid = parseInt(trimmed, 10);
          if (!isNaN(pid)) {
            pids.push(pid);
          }
        }
      }
      
      return pids;
    } catch (e) {
      return [];
    }
  }

  // Unix-like systems
  try {
    const { stdout } = await execFileAsync('ps', ['-o', 'pid=', '--ppid', String(pid)]);
    const pids: number[] = [];
    
    for (const line of stdout.trim().split('\n')) {
      const trimmed = line.trim();
      if (trimmed) {
        const pid = parseInt(trimmed, 10);
        if (!isNaN(pid)) {
          pids.push(pid);
        }
      }
    }
    
    return pids;
  } catch (e) {
    return [];
  }
}
