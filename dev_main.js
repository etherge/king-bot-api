import kingbot from './src';

const gameworld = 'COM2N';
const email = 'etherge@gmail.com';
const password = 'lkgpassw0rd@';
// only change if needed
const sitter_type = ''; // 'sitter' or 'dual'
const sitter_name = ''; // ingame avatar name
const port = 3000;

kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port);
