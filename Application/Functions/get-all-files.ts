import * as fs from "fs";
import * as path from "path";


export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}
