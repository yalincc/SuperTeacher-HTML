const fs = require('fs');
const path = require('path');
const dir = 'E:/WorkSpace/SuperTeacher-HTML/src/data/courses/chemistry-9b';
for (let i = 1; i <= 11; i++) {
  const num = String(i).padStart(2, '0');
  ['lesson-' + num + '.json', 'lesson-' + num + '-exercises.json'].forEach(f => {
    const fp = path.join(dir, f);
    let content = fs.readFileSync(fp, 'utf8');
    // Replace Chinese-style double quotes inside JSON string values with escaped quotes
    // Pattern: Chinese text with unescaped quotes like 填"纯净"
    // Replace pairs of Chinese double quotes with escaped versions
    // First, let's find problematic patterns: inside string values, unescaped "
    // Strategy: replace specific known Chinese quote patterns
    const replacements = [
      ['填"纯净"或"混合"', '填「纯净」或「混合」'],
      ['填"大"或"小"', '填「大」或「小」'],
      ['"中间金属两边盐"', '「中间金属两边盐」'],
      ['"两边金属中间盐"', '「两边金属中间盐」'],
    ];
    replacements.forEach(([from, to]) => {
      content = content.split(from).join(to);
    });
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed quotes: ' + f);
  });
}
