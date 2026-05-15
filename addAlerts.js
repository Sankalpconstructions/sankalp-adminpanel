const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'app', 'admin');

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (file === 'page.tsx') {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if it doesn't have a handleSubmit function
    if (!content.includes('const handleSubmit = async (e: React.FormEvent')) return;

    let modified = false;

    // 1. Import toast if not exists
    if (!content.includes('import toast from "react-hot-toast";')) {
        // Insert after last import
        const importsEnd = content.lastIndexOf('import ');
        const newlineAfterImports = content.indexOf('\n', importsEnd);
        content = content.substring(0, newlineAfterImports) + '\nimport toast from "react-hot-toast";' + content.substring(newlineAfterImports);
        modified = true;
    }

    // We will do a generic replacement if they don't have toast.success
    if (!content.includes('toast.success')) {
        // Replace setX(...) or setX([...]) with toasts inside handleSubmit
        // This is tricky, let's just find the res.ok blocks
        const resOkRegex = /if\s*\(res\.ok\)\s*\{([\s\S]*?)\}/g;
        
        content = content.replace(resOkRegex, (match, p1) => {
            if (p1.includes('toast.success')) return match;
            
            let message = "Item";
            if (filePath.includes('gallery')) message = "Gallery item";
            if (filePath.includes('herobanner')) message = "Banner slide";
            if (filePath.includes('faq')) message = "FAQ";
            if (filePath.includes('floorplans')) message = "Floorplan";
            if (filePath.includes('csr')) message = "CSR item";
            if (filePath.includes('brand-story')) message = "Story";
            if (filePath.includes('blog')) message = "Blog post";
            if (filePath.includes('amenities')) message = "Amenity";
            if (filePath.includes('about')) message = "About item";
            if (filePath.includes('projects')) message = "Project";
            if (filePath.includes('rental-commercial')) message = "Commercial property";
            if (filePath.includes('rental-residential')) message = "Residential property";

            let action = match.includes('updated') ? 'updated' : match.includes('created') ? 'added' : 'saved';
            if (match.includes('set') && !match.includes('toast.success')) {
                return `if (res.ok) {${p1}\n          toast.success("${message} ${action} successfully!");\n        }`;
            }
            return match;
        });
        modified = true;
    }

    // Add validation alert at the top of handleSubmit if missing
    // Find required inputs to determine required fields
    if (!content.includes('toast.error("Please fill in all required fields."')) {
        const requiredFields = [];
        const regex = /<input[^>]*required[^>]*value=\{formData\.(\w+)\}/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            requiredFields.push(match[1]);
        }
        
        const textareaRegex = /<textarea[^>]*required[^>]*value=\{formData\.(\w+)\}/g;
        while ((match = textareaRegex.exec(content)) !== null) {
            requiredFields.push(match[1]);
        }

        if (requiredFields.length > 0) {
            const validationCheck = `    if (${requiredFields.map(f => `!formData.${f}`).join(' || ')}) {
      toast.error("Please fill in all required fields.");
      return;
    }`;
            const handleSubmitStart = 'const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();';
            if (content.includes(handleSubmitStart)) {
                content = content.replace(handleSubmitStart, `${handleSubmitStart}\n${validationCheck}`);
                modified = true;
            } else {
                const handleSubmitStart2 = 'const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault();';
                if (content.includes(handleSubmitStart2)) {
                    content = content.replace(handleSubmitStart2, `${handleSubmitStart2}\n${validationCheck}`);
                    modified = true;
                }
            }
        }
    }

    // Add error toast
    if (!content.includes('toast.error("Failed to save')) {
        content = content.replace(/catch\s*\(\w*\)\s*\{\s*console\.error\([^)]+\);\s*\}/g, (match) => {
             return match.replace('}', '  toast.error("Failed to save changes.");\n    }');
        });
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Modified: ' + filePath);
    }
}

traverse(dirPath);
