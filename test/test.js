import {copyFileSync, existsSync, readdirSync} from 'fs';
import {basename, extname} from 'path';
import {canBeConvertedToPDF, convertTo} from './lib/index.js';

export const handler = async () => {
  const results = [];

  try {
    // Get all files from test-data directory
    const testDataDir = './test-data';

    if (!existsSync(testDataDir)) {
      throw new Error(`Test data directory ${testDataDir} not found`);
    }

    const files = readdirSync(testDataDir);
    const supportedFiles = files.filter(
      file =>
        // Skip already converted PDFs and use the validation function
        !file.endsWith('.pdf') && canBeConvertedToPDF(file)
    );

    console.log(`Found ${supportedFiles.length} files to convert:`, supportedFiles);

    // Process each file
    for (const file of supportedFiles) {
      try {
        console.log(`\nProcessing: ${file}`);

        // Copy file to /tmp for conversion
        const sourcePath = `${testDataDir}/${file}`;
        const tmpPath = `/tmp/${file}`;
        copyFileSync(sourcePath, tmpPath);
        console.log(`Copied to ${tmpPath}`);

        // Convert to PDF
        const convertedFilePath = await convertTo(file, 'pdf');
        console.log(`Converted to: ${convertedFilePath}`);

        // Copy the PDF to test-data directory (mounted volume)
        const outputFileName = `${basename(file, extname(file))}.pdf`;
        const outputPath = `/tmp/test-data/${outputFileName}`;

        if (existsSync('/tmp/test-data')) {
          copyFileSync(convertedFilePath, outputPath);
          console.log(`PDF saved to: ${outputPath}`);
          results.push({
            input: file,
            output: outputFileName,
            status: 'success',
          });
        } else {
          console.log('Output directory /tmp/test-data not found - volume not mounted?');
          results.push({
            input: file,
            output: outputFileName,
            status: 'no-output-dir',
          });
        }
      } catch (error) {
        console.error(`Failed to convert ${file}:`, error.message);
        results.push({
          input: file,
          status: 'error',
          error: error.message,
        });
      }
    }

    console.log('\n=== Conversion Summary ===');
    console.log(JSON.stringify(results, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Processed ${results.length} files`,
        results,
      }),
    };
  } catch (error) {
    console.error('Batch conversion failed:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};
