#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Configuration
const IGNORED_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vercel',
  '.github',
  'scripts',
  'public',
  '.vscode',
  'coverage'
];

const IGNORED_FILES = [
  '.DS_Store',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'package-lock.json',
  'yarn.lock',
  '.gitignore',
  'README.md',
  'LICENSE'
];

const IGNORED_EXTENSIONS = [
  '.map'
];

// Structure categories
const STRUCTURE_CATEGORIES = [
  {
    name: 'app-structure',
    title: 'Application Structure',
    path: 'app',
    description: 'Next.js App Router structure with pages and API routes'
  },
  {
    name: 'components-structure',
    title: 'Components Structure',
    path: 'components',
    description: 'React components organized by functionality'
  },
  {
    name: 'lib-structure',
    title: 'Library Structure',
    path: 'lib',
    description: 'Utility functions, hooks, and shared code'
  },
  {
    name: 'styles-structure',
    title: 'Styles Structure',
    path: 'styles',
    description: 'Global styles and CSS files'
  },
  {
    name: 'docs-structure',
    title: 'Documentation Structure',
    path: 'docs',
    description: 'Project documentation organized by category'
  }
];

// Main execution function
async function main() {
  try {
    console.log('🌳 Generating project tree structures...');
    
    // Create the project structure directory if it doesn't exist
    const structureDirPath = path.join(process.cwd(), 'docs', 'project-structure');
    if (!fs.existsSync(structureDirPath)) {
      fs.mkdirSync(structureDirPath, { recursive: true });
      console.log(`📁 Created directory: ${structureDirPath}`);
    }
    
    // Create index.md that links to all structure files
    let indexContent = `# Project Structure Documentation\n\n`;
    indexContent += `*Last Updated: ${new Date().toISOString().split('T')[0]}*\n\n`;
    indexContent += `This directory contains automatically generated tree structures for different parts of the Lofts des Arts codebase.\n`;
    indexContent += `These files are updated at the end of each development session to provide an up-to-date overview of the project structure.\n\n`;
    indexContent += `## Available Structure Documentation\n\n`;
    
    // Generate a tree structure for each category
    for (const category of STRUCTURE_CATEGORIES) {
      const categoryPath = path.join(process.cwd(), category.path);
      
      // Skip if the directory doesn't exist
      if (!fs.existsSync(categoryPath)) {
        console.log(`⚠️ Directory not found: ${categoryPath} - skipping`);
        continue;
      }
      
      console.log(`📊 Generating tree for: ${category.name}`);
      
      // Use tree command if available, otherwise use our custom tree function
      let treeContent;
      try {
        // Try to use the tree command if available (better formatting)
        const { stdout } = await exec(`tree -I "${IGNORED_DIRS.join('|')}" "${categoryPath}"`);
        treeContent = stdout;
      } catch (error) {
        // Fall back to our custom tree function
        console.log(`⚠️ Tree command failed, using custom implementation`);
        treeContent = generateTreeCustom(categoryPath, '', category.path);
      }
      
      // Create the content for the structure file
      let fileContent = `# ${category.title}\n\n`;
      fileContent += `*Last Updated: ${new Date().toISOString().split('T')[0]}*\n\n`;
      fileContent += `${category.description}\n\n`;
      fileContent += `\`\`\`\n${treeContent}\n\`\`\`\n`;
      
      // Save the tree structure to a file
      const fileName = `${category.name}.md`;
      const filePath = path.join(structureDirPath, fileName);
      fs.writeFileSync(filePath, fileContent);
      console.log(`✅ Saved tree structure to: ${filePath}`);
      
      // Add to index
      indexContent += `- [${category.title}](./${fileName}) - ${category.description}\n`;
    }
    
    // Generate full project tree (limited depth)
    try {
      console.log(`📊 Generating overall project tree`);
      let overallTreeContent;
      
      try {
        // Limit depth to prevent excessive output
        const { stdout } = await exec(`tree -L 2 -I "${IGNORED_DIRS.join('|')}" "${process.cwd()}"`);
        overallTreeContent = stdout;
      } catch (error) {
        // Fall back to our custom tree function with depth limit
        console.log(`⚠️ Tree command failed, using custom implementation`);
        overallTreeContent = generateTreeCustom(process.cwd(), '', '', 2);
      }
      
      let fileContent = `# Overall Project Structure\n\n`;
      fileContent += `*Last Updated: ${new Date().toISOString().split('T')[0]}*\n\n`;
      fileContent += `Top-level directories and files in the Lofts des Arts project.\n\n`;
      fileContent += `\`\`\`\n${overallTreeContent}\n\`\`\`\n`;
      
      const filePath = path.join(structureDirPath, 'overall-structure.md');
      fs.writeFileSync(filePath, fileContent);
      console.log(`✅ Saved overall tree structure to: ${filePath}`);
      
      // Add to index
      indexContent += `- [Overall Project Structure](./overall-structure.md) - Top-level directories and files\n`;
    } catch (error) {
      console.error(`❌ Error generating overall tree: ${error.message}`);
    }
    
    // Save the index file
    fs.writeFileSync(path.join(structureDirPath, 'index.md'), indexContent);
    console.log(`✅ Saved index to: ${path.join(structureDirPath, 'index.md')}`);
    
    console.log('🎉 All tree structures generated successfully!');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Custom tree generation function as fallback
function generateTreeCustom(dirPath, indent = '', rootName = '', maxDepth = Infinity, currentDepth = 0) {
  if (currentDepth > maxDepth) return '';
  
  const dirName = rootName || path.basename(dirPath);
  let result = `${indent}${dirName}/\n`;
  
  const items = fs.readdirSync(dirPath);
  
  // Process directories first, then files
  const dirs = [];
  const files = [];
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    
    // Skip ignored items
    if (IGNORED_DIRS.includes(item) || IGNORED_FILES.includes(item) || 
        IGNORED_EXTENSIONS.some(ext => item.endsWith(ext))) {
      continue;
    }
    
    if (isDirectory) {
      dirs.push(item);
    } else {
      files.push(item);
    }
  }
  
  // Process directories
  const nextIndent = indent + '    ';
  for (let i = 0; i < dirs.length; i++) {
    const isLast = i === dirs.length - 1 && files.length === 0;
    const prefix = isLast ? '└── ' : '├── ';
    const childIndent = nextIndent + (isLast ? '    ' : '│   ');
    
    const dirPath2 = path.join(dirPath, dirs[i]);
    result += `${nextIndent}${prefix}${dirs[i]}/\n`;
    
    if (currentDepth < maxDepth) {
      const subtree = generateTreeCustom(dirPath2, childIndent, '', maxDepth, currentDepth + 1);
      result += subtree;
    }
  }
  
  // Process files
  for (let i = 0; i < files.length; i++) {
    const isLast = i === files.length - 1;
    const prefix = isLast ? '└── ' : '├── ';
    result += `${nextIndent}${prefix}${files[i]}\n`;
  }
  
  return result;
}

// Run the script
main(); 