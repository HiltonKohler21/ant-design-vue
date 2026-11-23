const check = [
  'check',
  'done',
  'todo',
  'tick',
  'complete',
  'finish',
  'task',
  'ok',
  'success',
  'confirm',
  'approve',
  'agree',
  'validation',
  '√',
  '✔',
  '✓',
  '勾',
  '对',
  '正确',
  'right',
];

const financial = [
  'monetization',
  'marketing',
  'currency',
  'money',
  'payment',
  'finance',
  'cash',
  'bank',
  'transaction',
  'balance',
  'expense',
  'income',
  'budget',
  'investment',
  'savings',
  'profit',
  'cost',
  'wealth',
  'economy',
  'wallet',
  'exchange',
];

const ellipsis = [
  '...',
  '。。。',
  '…',
  'more',
  '更多',
  'dots',
  'ellipsis',
  'expand',
  'collapse',
  'menu',
  'dropdown',
  'options',
  'settings',
  'et cetera',
  'etc',
  'loader',
  'loading',
  'progress',
  'pending',
  'throbber',
  'spinner',
  'operator',
  'code',
  'spread',
  'rest',
  'further',
  'extra',
  'overflow',
];

const logoMeta = tags => ({
  tags,
  category: 'logo',
});

const Alipay = {
  tags: [...financial],
  category: 'logo',
};

const Check = {
  tags: [...check],
  category: 'suggestion',
};

const Dash = {
  tags: [...ellipsis],
  category: 'editor',
};

const Euro = {
  tags: [...financial],
  category: 'other',
};

const PoundCircle = {
  tags: [...financial],
  category: 'other',
};

const arrow = ['arrow', 'direction', '箭头', '方向'];

const Arrow = {
  tags: [...arrow],
  category: 'direction',
};

const metaInfo = {
  AccountBook: {
    tags: [...financial, 'ledger'],
    category: 'other',
  },
  Alipay,
  AlipayCircle: Alipay,
  ArrowUp: Arrow,
  ArrowDown: Arrow,
  ArrowLeft: Arrow,
  ArrowRight: Arrow,
  ArrowsAlt: Arrow,
  Bank: {
    tags: [...financial],
    category: 'other',
  },
  CarryOut: {
    tags: [...check],
    category: 'other',
  },
  Check,
  CheckCircle: Check,
  CheckSquare: Check,
  ClockSquare: {
    tags: ['time', 'watch', 'alarm'],
    category: 'suggestion',
  },
  Comment: {
    tags: [...ellipsis, 'feedback', 'discussion', 'reply', 'opinion', 'note'],
    category: 'other',
  },
  Copy: {
    tags: ['复制', 'clone', 'duplicate'],
    category: 'editor',
  },
  CreditCard: {
    tags: [...financial],
    category: 'other',
  },
  Dash,
  SmallDash: Dash,
  Dollar: {
    tags: [...financial],
    category: 'other',
  },
  Ellipsis: {
    tags: [...ellipsis],
    category: 'other',
  },
  Euro,
  EuroCircle: Euro,
  Holder: {
    tags: [...ellipsis],
    category: 'other',
  },
  IssuesClose: {
    tags: [...check],
    category: 'suggestion',
  },
  More: {
    tags: [...ellipsis, 'vertical'],
    category: 'other',
  },
  PayCircle: {
    tags: [...financial],
    category: 'other',
  },
  PoundCircle,
  Pound: PoundCircle,
  PropertySafety: {
    tags: [...financial, 'safety', 'protection', 'security', 'shield'],
    category: 'other',
  },
  RedEnvelope: {
    tags: [...financial],
    category: 'other',
  },
  Robot: {
    tags: ['ai'],
    category: 'other',
  },
  Safety: {
    tags: [...check, 'protection', 'security', 'shield', 'safety', 'privacy'],
    category: 'other',
  },
  Schedule: {
    tags: [...check, 'time', 'clock', 'calendar'],
    category: 'other',
  },
  Search: {
    tags: ['search', 'find', 'magnifier', '搜索', '查找', '放大镜'],
    category: 'other',
  },
  Transaction: {
    tags: [...financial],
    category: 'other',
  },
  Telegram: logoMeta(['telegram', 'social', 'message']),
  Mastodon: logoMeta(['mastodon', 'social']),
  Threads: logoMeta(['threads', 'social']),
  Snapchat: logoMeta(['snapchat', 'social']),
  Anthropic: logoMeta(['anthropic', 'ai', 'llm']),
  Claude: logoMeta(['claude', 'anthropic', 'ai', 'llm']),
  Gemini: logoMeta(['gemini', 'google', 'ai', 'llm']),
  Mistral: logoMeta(['mistral', 'ai', 'llm']),
  DeepSeek: logoMeta(['deepseek', 'deep seek', 'deep-seek', 'ai', 'llm']),
  Qwen: logoMeta(['qwen', 'tongyi', 'ai', 'llm']),
  Perplexity: logoMeta(['perplexity', 'ai', 'llm', 'search']),
  HuggingFace: logoMeta(['huggingface', 'hugging face', 'hugging-face', 'ai', 'llm']),
  Ollama: logoMeta(['ollama', 'ai', 'llm']),
  Replicate: logoMeta(['replicate', 'ai', 'llm']),
  ElevenLabs: logoMeta(['elevenlabs', 'eleven labs', 'eleven-labs', 'ai', 'voice']),
};

export default metaInfo;
