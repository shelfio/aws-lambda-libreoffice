import {copyFileSync, existsSync, mkdirSync, readdirSync} from 'node:fs';
import {basename, extname, join} from 'node:path';
import {canBeConvertedToPDF, convertTo} from '../../../lib/index.js';

const TMP_DIR = '/tmp';
const OUTPUT_DIR = process.env.TEST_OUTPUT_DIR ?? join(TMP_DIR, 'test-data');
const TEST_DATA_DIR = process.env.TEST_INPUT_DIR ?? join(TMP_DIR, 'fixtures');

type ConversionSuccess = {
  input: string;
  output: string;
  status: 'success' | 'no-output-dir';
};

type ConversionFailure = {
  input: string;
  status: 'error';
  error: string;
};

type ConversionResult = ConversionSuccess | ConversionFailure;

type HandlerResponse = {
  statusCode: number;
  body: string;
};

const ensureDirectory = (directory: string) => {
  if (!existsSync(directory)) {
    mkdirSync(directory, {recursive: true});
  }
};

export const handler = async (): Promise<HandlerResponse> => {
  const results: ConversionResult[] = [];

  try {
    ensureDirectory(OUTPUT_DIR);

    if (!existsSync(TEST_DATA_DIR)) {
      throw new Error(`Test data directory ${TEST_DATA_DIR} not found`);
    }

    const files = readdirSync(TEST_DATA_DIR);
    const supportedFiles = files.filter(
      file => !file.endsWith('.pdf') && canBeConvertedToPDF(file)
    );

    console.log(`Found ${supportedFiles.length} files to convert:`, supportedFiles);

    for (const file of supportedFiles) {
      try {
        console.log(`\nProcessing: ${file}`);

        const sourcePath = join(TEST_DATA_DIR, file);
        const tmpPath = join(TMP_DIR, file);
        copyFileSync(sourcePath, tmpPath);
        console.log(`Copied to ${tmpPath}`);

        const convertedFilePath = await convertTo(file, 'pdf');
        console.log(`Converted to: ${convertedFilePath}`);

        const outputFileName = `${basename(file, extname(file))}.pdf`;
        const outputPath = join(OUTPUT_DIR, outputFileName);

        if (existsSync(OUTPUT_DIR)) {
          copyFileSync(convertedFilePath, outputPath);
          console.log(`PDF saved to: ${outputPath}`);
          results.push({
            input: file,
            output: outputFileName,
            status: 'success',
          });
        } else {
          console.log(`Output directory ${OUTPUT_DIR} not found - volume not mounted?`);
          results.push({
            input: file,
            output: outputFileName,
            status: 'no-output-dir',
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to convert ${file}:`, message);
        results.push({
          input: file,
          status: 'error',
          error: message,
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'no stack');
    throw error;
  }
};

export default handler;
