import { readFileSync } from 'fs';

const dirs = ['history-7a', 'history-7b', 'history-8a', 'history-8b', 'history-9a'];

for (const d of dirs) {
  const base = 'src/data/courses/' + d;
  const cfs = JSON.parse(readFileSync(base + '/course.json', 'utf8'));
  const maxId = Math.max(...cfs.lessons.map(l => l.id));
  const issues = [];
  let totalCallouts = 0, totalExercises = 0, totalExamples = 0, lessonsWithIssues = 0;

  for (let i = 1; i <= maxId; i++) {
    const n = String(i).padStart(2, '0');
    try {
      const ld = JSON.parse(readFileSync(base + '/lesson-' + n + '.json', 'utf8'));
      const ed = JSON.parse(readFileSync(base + '/lesson-' + n + '-exercises.json', 'utf8'));
      const objCount = ld.objectives.length;
      const kgCount = ld.knowledge.length;
      const exCount = ld.examples.length;
      const callouts = ld.knowledge.flatMap(k => k.blocks.filter(b => b.type === 'callout')).length;
      const choices = ed.exercises.filter(e => e.type === 'choice').length;
      const tfs = ed.exercises.filter(e => e.type === 'true_false').length;
      const fills = ed.exercises.filter(e => e.type === 'fill').length;

      totalCallouts += callouts;
      totalExercises += ed.exercises.length;
      totalExamples += exCount;

      const lIssues = [];
      if (objCount < 3 || objCount > 6) lIssues.push('目标:' + objCount);
      if (kgCount < 2 || kgCount > 4) lIssues.push('分区:' + kgCount);
      if (exCount !== 2) lIssues.push('例题:' + exCount);
      if (ed.exercises.length !== 4) lIssues.push('练习:' + ed.exercises.length);
      if (choices !== 2) lIssues.push('选择:' + choices);
      if (tfs !== 1) lIssues.push('判断:' + tfs);
      if (fills !== 1) lIssues.push('填空:' + fills);
      const kgNoCallout = ld.knowledge.filter(k => k.blocks.filter(b => b.type === 'callout').length === 0);
      if (kgNoCallout.length > 0) lIssues.push('callout缺失:' + kgNoCallout.length + '区');

      if (lIssues.length > 0) {
        issues.push('lesson-' + n + ': ' + lIssues.join(', '));
        lessonsWithIssues++;
      }
    } catch (e) {}
  }

  console.log('=== ' + d + ' (' + maxId + '课) ===');
  console.log('  有问题: ' + lessonsWithIssues + ' 课');
  console.log('  callout: 平均 ' + (totalCallouts / maxId).toFixed(1) + '/课');
  console.log('  练习题: 平均 ' + (totalExercises / maxId).toFixed(1) + '/课');
  console.log('  例题: 平均 ' + (totalExamples / maxId).toFixed(1) + '/课');
  if (issues.length > 0) {
    console.log('  问题:');
    issues.forEach(i => console.log('    ' + i));
  }
  console.log();
}
