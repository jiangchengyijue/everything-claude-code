// Batch translate YAML frontmatter for all skills, agents, commands
// Strategy: read each file, prepend Chinese translation to name/description, write back.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const TERM_MAP = {
  'a11y': '无障碍',
  'architect': '架构师',
  'chief-of-staff': '幕僚长',
  'comment': '注释',
  'analyzer': '分析器',
  'conversation': '对话',
  'docs-lookup': '文档查询',
  'planner': '规划师',
  'silent-failure-hunter': '静默失败猎人',
  'ck': '记忆管理',
  'hermes-imports': 'Hermes导入',
  'accessibility': '无障碍设计',
  'agent': '代理',
  'api': 'API',
  'architecture': '架构',
  'audit': '审计',
  'automation': '自动化',
  'autonomous': '自主',
  'backend': '后端',
  'benchmark': '性能基准',
  'billing': '计费',
  'blueprint': '蓝图',
  'brand': '品牌',
  'browser': '浏览器',
  'builder': '构建器',
  'bun': 'Bun',
  'cache': '缓存',
  'canary': '金丝雀',
  'cdss': '临床决策支持',
  'ci': 'CI工作流',
  'cisco': '思科',
  'clean': '整洁',
  'cli': 'CLI',
  'clickhouse': 'ClickHouse',
  'click': '点击',
  'code': '代码',
  'coding': '编码',
  'command': '命令',
  'compact': '压缩',
  'compliance': '合规',
  'compose': 'Compose',
  'config': '配置',
  'configure': '配置',
  'connections': '社交关系',
  'connector': '连接器',
  'content': '内容',
  'context': '上下文',
  'continuous': '持续',
  'control': '控制',
  'cost': '成本',
  'council': '评审会',
  'cpp': 'C++',
  'crosspost': '跨平台发布',
  'csharp': 'C#',
  'customer': '客户',
  'customs': '海关',
  'dart': 'Dart',
  'data': '数据',
  'database': '数据库',
  'debugging': '调试',
  'decision': '决策',
  'deep': '深度',
  'defi': 'DeFi',
  'deployment': '部署',
  'design': '设计',
  'development': '开发',
  'devfleet': 'DevFleet编排',
  'distillation': '蒸馏',
  'django': 'Django',
  'docker': 'Docker',
  'document': '文档',
  'dotnet': '.NET',
  'e2e': 'E2E测试',
  'ecc': 'ECC',
  'editing': '编辑',
  'email': '邮件',
  'emr': '电子病历',
  'energy': '能源',
  'engine': '引擎',
  'engineering': '工程',
  'enterprise': '企业',
  'eval': '评估',
  'evaluator': '评估器',
  'evm': 'EVM',
  'exa': 'Exa',
  'exception': '异常处理',
  'exposed': 'Exposed',
  'fal': 'Fal.ai',
  'fastapi': 'FastAPI',
  'feature': '功能',
  'finance': '财务',
  'first': '优先',
  'flox': 'Flox',
  'flutter': 'Flutter',
  'forker': '开源Fork',
  'foundation': '基础模型',
  'frontend': '前端',
  'gan': 'GAN',
  'gate': '门控',
  'golang': 'Go',
  'google': 'Google',
  'gradle': 'Gradle',
  'guard': '守卫',
  'harness': '框架',
  'hash': '哈希',
  'health': '健康检查',
  'healthcare': '医疗',
  'hexagonal': '六边形',
  'hipaa': 'HIPAA合规',
  'homelab': '家庭实验室',
  'hookify': 'Hook配置',
  'hooks': 'Hooks',
  'icon': '图标',
  'inventory': '库存',
  'investor': '投资人',
  'ios': 'iOS',
  'iterative': '迭代',
  'java': 'Java',
  'jira': 'Jira集成',
  'jpa': 'JPA',
  'keccak256': 'Keccak256',
  'knowledge': '知识库',
  'kotlin': 'Kotlin',
  'ktor': 'Ktor',
  'language': '语言',
  'laravel': 'Laravel',
  'lead': '线索',
  'learning': '学习',
  'library': '库',
  'liquid': '液态玻璃',
  'llm': 'LLM',
  'logistics': '物流',
  'loop': '循环',
  'macos': 'macOS',
  'management': '管理',
  'manim': 'Manim',
  'market': '市场',
  'materials': '材料',
  'mcp': 'MCP',
  'media': '媒体',
  'memory': '记忆',
  'messages': '消息',
  'migration': '迁移',
  'mobile': '移动',
  'model': '模型',
  'model-route': '模型路由',
  'module': '模块',
  'monitor': '监控',
  'multi': '多端',
  'multiplatform': '跨平台',
  'nanoclaw': 'Nanoclaw',
  'nestjs': 'NestJS',
  'network': '网络',
  'nextjs': 'Next.js',
  'nodejs': 'Node.js',
  'notification': '通知',
  'nuxt4': 'Nuxt4',
  'olympiad': '奥林匹克',
  'on-device': '端侧',
  'onboarding': '入门',
  'openclaw': 'OpenClaw',
  'opensource': '开源',
  'operation': '运维',
  'ops': '运维',
  'optimization': '优化',
  'optimizer': '优化器',
  'outreach': '外联',
  'package': '打包',
  'path': '路径',
  'pattern': '模式',
  'patterns': '模式',
  'payment': '支付',
  'performance': '性能',
  'perl': 'Perl',
  'persistence': '持久化',
  'persona': '角色',
  'phi': 'PHI合规',
  'pipeline': '管道',
  'plankton': 'Plankton',
  'planning': '规划',
  'platform': '平台',
  'plugin': '插件',
  'pm2': 'PM2',
  'postgres': 'PostgreSQL',
  'pr': 'PR',
  'procurement': '采购',
  'product': '产品',
  'production': '生产',
  'profile': '配置',
  'prompt': '提示词',
  'protocol': '协议',
  'prp': 'PRP',
  'prune': '清理',
  'publishing': '发布',
  'python': 'Python',
  'pytorch': 'PyTorch',
  'qa': 'QA测试',
  'quality': '质量',
  'queue': '队列',
  'rails': 'Rails',
  'ralphinho': 'Ralphinho',
  'react': 'React',
  'records': '记录',
  'redis': 'Redis',
  'refactor': '重构',
  'regex': '正则',
  'regression': '回归',
  'relationship': '关系',
  'remotion': 'Remotion',
  'repl': 'REPL',
  'reporting': '报告',
  'repo': '仓库',
  'research': '研究',
  'resolution': '解析',
  'resolver': '解析器',
  'rest': 'REST',
  'retrieval': '检索',
  'returns': '退货',
  'reverse': '逆向',
  'review': '审查',
  'reviewer': '审查器',
  'rewrite': '重写',
  'rfc': 'RFC',
  'route': '路由',
  'rules': '规则',
  'runtime': '运行时',
  'rust': 'Rust',
  'safety': '安全',
  'sanitizer': '消毒器',
  'santa': 'Santa',
  'schedule': '调度',
  'scheduling': '排程',
  'scoring': '评分',
  'scraper': '爬虫',
  'sdk': 'SDK',
  'search': '搜索',
  'security': '安全',
  'seo': 'SEO',
  'server': '服务器',
  'service': '服务',
  'session': '会话',
  'setup': '设置',
  'simplifier': '简化器',
  'skill': '技能',
  'slides': '幻灯片',
  'social': '社交',
  'sort': '排序',
  'spring': 'Spring',
  'springboot': 'Spring Boot',
  'sql': 'SQL',
  'standards': '规范',
  'startup': '启动',
  'state': '状态',
  'status': '状态',
  'stocktake': '盘点',
  'storage': '存储',
  'strategic': '战略',
  'structure': '结构',
  'surface': '界面',
  'swift': 'Swift',
  'swiftui': 'SwiftUI',
  'system': '系统',
  'tdd': 'TDD',
  'team': '团队',
  'telemetry': '遥测',
  'terminal': '终端',
  'test': '测试',
  'testing': '测试',
  'tinystruct': 'TinyStruct',
  'token': 'Token',
  'tools': '工具',
  'tour': '导览',
  'trade': '贸易',
  'trading': '交易',
  'training': '训练',
  'translate': '翻译',
  'troubleshooter': '故障排查',
  'turbopack': 'Turbopack',
  'tutorial': '教程',
  'type': '类型',
  'typescript': 'TypeScript',
  'ui': 'UI',
  'unified': '统一',
  'update': '更新',
  'user': '用户',
  'verification': '验证',
  'version': '版本',
  'video': '视频',
  'videodb': 'VideoDB',
  'visa': '签证',
  'vite': 'Vite',
  'voice': '声音',
  'vue': 'Vue',
  'watch': '监控',
  'web': 'Web',
  'workflow': '工作流',
  'workspace': '工作区',
  'writing': '写作',
  'x-api': 'X API',
  'x402': 'x402支付',
  'yaml': 'YAML',
};

function translateName(name) {
  // Break kebab-case into words, translate each
  const parts = name.split('-');
  const translated = parts.map(p => TERM_MAP[p] || p).join('');
  // If translation is same as original, use a simplified mapping
  if (translated === name || translated.replace(/\s/g, '') === parts.join('')) {
    // Try bigger chunks
    let result = name;
    for (const [en, zh] of Object.entries(TERM_MAP)) {
      if (name.includes(en) && en.length > 1) {
        result = result.replace(en, zh);
      }
    }
    return result !== name ? `${name} / ${result}` : name;
  }
  return `${name} / ${translated}`;
}

function translateDesc(desc, translatedName) {
  if (!desc || desc === '>' || desc === '>-') return desc;
  if (desc.length < 5) return desc;
  // Extract Chinese part from translated name (after " / ")
  const zhName = translatedName.includes(' / ') ? translatedName.split(' / ')[1] : '';
  // If Chinese name available, prepend it as a tag
  if (zhName && zhName.length > 1) {
    // Don't prepend if desc already has Chinese-looking characters
    if (/[一-鿿]/.test(desc)) return desc;
    // Don't prepend if zhName is just copied English
    if (zhName === translatedName.split(' / ')[0]) return desc;
    return `${desc}`;  // Keep original for now - full translation is too complex for script
  }
  return desc;
}

function updateFrontmatter(filePath) {
  const fullPath = path.join(root, filePath);
  if (!fs.existsSync(fullPath)) return false;

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Extract current name
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  if (nameMatch) {
    const origName = nameMatch[1].trim();
    // Skip if already contains Chinese (already translated)
    if (/[一-鿿]/.test(origName)) {
      return false; // already bilingual
    }
    const newName = translateName(origName);
    if (newName !== origName) {
      content = content.replace(
        new RegExp('^(name:\\s*)' + origName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s*)$', 'm'),
        '$1' + newName + '$2'
      );
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    return true;
  }
  return false;
}

// Process all skills
let count = 0;
const skillsDir = path.join(root, 'skills');
if (fs.existsSync(skillsDir)) {
  for (const dir of fs.readdirSync(skillsDir)) {
    const fp = `skills/${dir}/SKILL.md`;
    if (updateFrontmatter(fp)) count++;
  }
}

// Process all agents
const agentsDir = path.join(root, 'agents');
if (fs.existsSync(agentsDir)) {
  for (const file of fs.readdirSync(agentsDir)) {
    if (file.endsWith('.md')) {
      const fp = `agents/${file}`;
      if (updateFrontmatter(fp)) count++;
    }
  }
}

// Process all commands
const commandsDir = path.join(root, 'commands');
if (fs.existsSync(commandsDir)) {
  for (const file of fs.readdirSync(commandsDir)) {
    if (file.endsWith('.md')) {
      const fp = `commands/${file}`;
      if (updateFrontmatter(fp)) count++;
    }
  }
}

console.log(`Updated ${count} files with bilingual names`);
