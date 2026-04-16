import os
import subprocess
import glob

directory = '/Users/jimmypak/deli-cheap/YO'
files = sorted(glob.glob(f'{directory}/*.PNG'))

with open('ocr_results.txt', 'w') as out:
    for f in files:
        try:
            result = subprocess.run(['tesseract', f, 'stdout', '-l', 'kor'], capture_output=True, text=True)
            out.write(f'--- {os.path.basename(f)} ---\n')
            out.write(result.stdout)
            out.write('\n')
        except Exception as e:
            out.write(f'Error processing {f}: {e}\n')
