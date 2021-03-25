import * as shell from 'shelljs';

shell.cp('-R', 'src/views', 'dist/');
shell.cp('-R', 'src/public/css', 'dist/');
shell.cp('-R', 'src/public/js', 'dist/');
shell.cp('-R', 'src/public/fonts', 'dist/');
shell.cp('-R', 'src/public/img', 'dist/');
