#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import argparse

def export_py_files(root_dir: str, output_file: str):
    """
    遍歷 root_dir 下的所有 .py 檔案（排除 __pycache__、venv 及執行本身），
    並將每個檔案的相對路徑與內容寫入到 output_file。
    """
    script_name = os.path.basename(__file__)  # 腳本檔名，用於排除自身

    with open(output_file, 'w', encoding='utf-8') as outf:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # 排除 __pycache__ 與 venv 資料夾
            dirnames[:] = [d for d in dirnames if d not in ("__pycache__", "venv")]
            for fname in filenames:
                # 排除非 .py 或執行本身
                if not fname.endswith('.py') or fname == script_name:
                    continue

                abs_path = os.path.join(dirpath, fname)
                rel_path = os.path.relpath(abs_path, root_dir)

                # 寫入檔案標題
                outf.write(f'# ===== File: {rel_path} =====\n')
                # 寫入檔案內容
                try:
                    with open(abs_path, 'r', encoding='utf-8') as f:
                        outf.write(f.read())
                except UnicodeDecodeError:
                    # fallback
                    with open(abs_path, 'r', encoding='latin-1') as f:
                        outf.write(f.read())
                outf.write('\n\n')

    print(f'✅ 已將所有 .py 檔案匯出至：{output_file}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='匯出專案中所有 .py 檔案到單一 txt，保留資料夾結構，並排除 venv、__pycache__ 與腳本本身'
    )
    parser.add_argument(
        'root',
        nargs='?',
        default='.',
        help='專案根目錄（預設當前目錄）'
    )
    parser.add_argument(
        '-o', '--output',
        default='project_export.txt',
        help='輸出檔名（預設 project_export.txt）'
    )
    args = parser.parse_args()
    export_py_files(args.root, args.output)
