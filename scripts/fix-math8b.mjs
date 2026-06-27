import fs from 'fs';
import path from 'path';

const dir = 'E:/WorkSpace/SuperTeacher-HTML/src/data/courses/math-8b/';
const files = [
  'lesson-01-exercises.json', 'lesson-02-exercises.json', 'lesson-02.json',
  'lesson-04.json', 'lesson-05-exercises.json', 'lesson-05.json',
  'lesson-07.json', 'lesson-08.json', 'lesson-09-exercises.json',
  'lesson-09.json', 'lesson-13.json', 'lesson-14.json'
];

for (const f of files) {
  let content = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Fix 1: Double-escape single backslashes before LaTeX commands
  // Match: \letter(s) that are NOT already \\
  content = content.replace(/(?<!\\)\\(triangle|cong|angle|text|cdot|square|begin|end|cases|frac|sqrt|sim|le|ge|ne|pm|times|div|Delta|Sigma|square)/g, '\\\\$1');
  
  // Fix 2: Escape unescaped Chinese-style quotes inside JSON string values
  // Pattern: "word" used as Chinese quotes
  content = content.replace(/(\u4e00-\u9fff])"([^"]{1,20})"/g, '$1\\"$2\\"');
  content = content.replace(/"([^"]{1,20})"(\u4e00-\u9fff])/g, '\\"$1\\"$2');
  
  fs.writeFileSync(path.join(dir, f), content, 'utf8');
  
  try {
    JSON.parse(content);
    console.log('OK:', f);
  } catch (e) {
    console.log('FAIL:', f, e.message.substring(0, 80));
  }
}
