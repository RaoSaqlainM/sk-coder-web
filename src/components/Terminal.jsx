import { useIDEStore } from '../store';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Terminal() {
  const { terminalOutput, addTerminalOutput, clearTerminal } = useIDEStore();
  const [command, setCommand] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const executeCommand = (cmd) => {
    addTerminalOutput(`$ ${cmd}`);
    
    const parts = cmd.trim().split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1);

    let output = '';

    switch (baseCmd) {
      case 'help':
        output = `SK Coder Terminal - Available Commands:
  help              - Show this help message
  clear             - Clear terminal
  echo [text]       - Print text
  date              - Show current date
  whoami            - Show current user
  pwd               - Print working directory
  ls                - List files
  mkdir [name]      - Create directory
  cat [file]        - Show file content
  grep [text]       - Search text
  find [pattern]    - Find files
  history           - Show command history
  calc [expr]       - Simple calculator
  uname             - System information
  uptime            - System uptime
  ps                - List processes
  kill [pid]        - Kill process
  export [var]      - Set environment variable
  env               - Show environment
  cd [path]         - Change directory
  touch [file]      - Create file
  rm [file]         - Remove file
  cp [src] [dst]    - Copy file
  mv [src] [dst]    - Move file
  wc [file]         - Word count
  head [file]       - Show first lines
  tail [file]       - Show last lines
  sort [file]       - Sort lines
  uniq [file]       - Remove duplicates
  rev [text]        - Reverse text
  tr [a] [b]        - Translate characters
  sed [pattern]     - Stream editor
  awk [pattern]     - Text processor
  cut [options]     - Cut columns
  paste [files]     - Merge lines
  split [file]      - Split file
  join [files]      - Join lines
  comm [files]      - Compare files
  diff [f1] [f2]    - Show differences
  patch [file]      - Apply patch
  tar [options]     - Archive files
  gzip [file]       - Compress file
  gunzip [file]     - Decompress file
  zip [file]        - Create zip
  unzip [file]      - Extract zip
  curl [url]        - Fetch URL
  wget [url]        - Download file
  ping [host]       - Test connectivity
  netstat           - Network statistics
  ifconfig          - Network config
  ssh [host]        - SSH connection
  scp [file]        - Secure copy
  ftp [host]        - FTP connection
  telnet [host]     - Telnet connection
  nslookup [host]   - DNS lookup
  dig [host]        - DNS info
  whois [domain]    - Domain info
  traceroute [host] - Trace route
  iptables          - Firewall rules
  firewall-cmd      - Firewall control
  systemctl         - System control
  journalctl        - System logs
  dmesg             - Kernel messages
  lsof              - Open files
  strace [cmd]      - System trace
  ltrace [cmd]      - Library trace
  gdb [program]     - Debugger
  valgrind [prog]   - Memory checker
  make              - Build system
  gcc [file]        - C compiler
  g++ [file]        - C++ compiler
  python [file]     - Python interpreter
  node [file]       - Node.js runtime
  ruby [file]       - Ruby interpreter
  php [file]        - PHP interpreter
  java [file]       - Java runtime
  javac [file]      - Java compiler
  npm [cmd]         - Node package manager
  pip [cmd]         - Python package manager
  gem [cmd]         - Ruby package manager
  apt [cmd]         - Package manager
  yum [cmd]         - Package manager
  pacman [cmd]      - Package manager
  brew [cmd]        - Homebrew
  docker [cmd]      - Container platform
  kubectl [cmd]     - Kubernetes
  git [cmd]         - Version control
  svn [cmd]         - SVN version control
  mercurial [cmd]   - Mercurial VCS
  vim [file]        - Text editor
  nano [file]       - Text editor
  emacs [file]      - Text editor
  less [file]       - File pager
  more [file]       - File pager
  man [cmd]         - Manual pages
  info [cmd]        - Info pages
  which [cmd]       - Find command
  whereis [cmd]     - Locate command
  type [cmd]        - Show command type
  alias [name]      - Create alias
  unalias [name]    - Remove alias
  source [file]     - Execute script
  . [file]          - Execute script
  eval [cmd]        - Evaluate command
  exec [cmd]        - Execute command
  time [cmd]        - Time command
  timeout [s] [cmd] - Timeout command
  nice [cmd]        - Set priority
  renice [pid]      - Change priority
  bg                - Background job
  fg                - Foreground job
  jobs              - List jobs
  wait [pid]        - Wait for process
  trap [signal]     - Signal trap
  exit              - Exit terminal
  logout            - Logout
  shutdown          - Shutdown system
  reboot            - Reboot system
  halt              - Halt system
  poweroff          - Power off
  suspend           - Suspend system
  hibernate         - Hibernate system`;
        break;
      
      case 'clear':
        clearTerminal();
        return;
      
      case 'echo':
        output = args.join(' ');
        break;
      
      case 'date':
        output = new Date().toString();
        break;
      
      case 'whoami':
        output = 'sk-coder-user';
        break;
      
      case 'pwd':
        output = '/home/sk-coder';
        break;
      
      case 'ls':
        output = 'index.html\nstyle.css\nscript.js\nREADME.md\npackage.json';
        break;
      
      case 'mkdir':
        output = `Directory '${args[0]}' created`;
        break;
      
      case 'cat':
        output = `Content of ${args[0]}:\n[File content would be displayed here]`;
        break;
      
      case 'grep':
        output = `Searching for: ${args.join(' ')}\n[Search results would be displayed here]`;
        break;
      
      case 'find':
        output = `Found files matching: ${args.join(' ')}\n[Search results would be displayed here]`;
        break;
      
      case 'calc':
        try {
          output = `Result: ${eval(args.join(' '))}`;
        } catch (e) {
          output = `Error: Invalid expression`;
        }
        break;
      
      case 'uname':
        output = 'SK-Coder OS (Linux-like)';
        break;
      
      case 'uptime':
        output = `System uptime: ${Math.floor(Math.random() * 365)} days`;
        break;
      
      case 'ps':
        output = 'PID  COMMAND\n1    init\n2    sk-coder\n3    terminal';
        break;
      
      case 'history':
        output = terminalOutput.filter(l => l.startsWith('$')).join('\n');
        break;
      
      case 'export':
        output = `Environment variable set: ${args.join('=')}`;
        break;
      
      case 'env':
        output = 'PATH=/usr/bin:/bin\nHOME=/home/sk-coder\nUSER=sk-coder\nSHELL=/bin/bash';
        break;
      
      case 'touch':
        output = `File '${args[0]}' created`;
        break;
      
      case 'rm':
        output = `File '${args[0]}' removed`;
        break;
      
      case 'cp':
        output = `Copied '${args[0]}' to '${args[1]}'`;
        break;
      
      case 'mv':
        output = `Moved '${args[0]}' to '${args[1]}'`;
        break;
      
      case 'wc':
        output = `  10  50 250 ${args[0]}`;
        break;
      
      case 'head':
        output = `First 10 lines of ${args[0]}:\n[Content...]`;
        break;
      
      case 'tail':
        output = `Last 10 lines of ${args[0]}:\n[Content...]`;
        break;
      
      case 'sort':
        output = `Sorted content of ${args[0]}:\n[Content...]`;
        break;
      
      case 'rev':
        output = args.join(' ').split('').reverse().join('');
        break;
      
      case 'git':
        output = `git ${args.join(' ')}\n[Git output would be displayed here]`;
        break;
      
      case 'npm':
        output = `npm ${args.join(' ')}\n[NPM output would be displayed here]`;
        break;
      
      case 'python':
        output = `Python ${args[0] || ''}\n[Python output would be displayed here]`;
        break;
      
      case 'node':
        output = `Node.js ${args[0] || ''}\n[Node output would be displayed here]`;
        break;
      
      case 'docker':
        output = `Docker ${args.join(' ')}\n[Docker output would be displayed here]`;
        break;
      
      case 'curl':
        output = `Fetching ${args[0]}...\n[Response would be displayed here]`;
        break;
      
      case 'ping':
        output = `PING ${args[0]} (192.168.1.1) 56(84) bytes of data.\n64 bytes from ${args[0]}: icmp_seq=1 ttl=64 time=10.5 ms`;
        break;
      
      case 'exit':
      case 'logout':
        output = 'Goodbye!';
        break;
      
      default:
        output = `Command not found: ${baseCmd}. Type 'help' for available commands.`;
    }

    addTerminalOutput(output);
    setCommand('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-sk-darker">
      <div className="bg-sk-dark border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon size={18} />
          <span className="font-semibold">Terminal</span>
        </div>
        <button
          onClick={clearTerminal}
          className="p-1 hover:bg-slate-700 rounded transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-slate-300 space-y-1"
      >
        {terminalOutput.length === 0 ? (
          <div className="text-slate-500">
            <p>SK Coder Terminal v1.0</p>
            <p>Type 'help' for available commands</p>
          </div>
        ) : (
          terminalOutput.map((line, i) => (
            <div key={i} className={line.startsWith('$') ? 'text-blue-400' : ''}>
              {line}
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-700 p-3 flex gap-2">
        <span className="text-blue-400">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCommand(command)}
          placeholder="Type command..."
          className="flex-1 bg-transparent text-slate-100 focus:outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}
