import os

# List of directories containing different codebases
codebase_dirs = {
    "codebase": "./",
}

# Directories to include for each codebase
include_dirs = {
    "codebase": [ "backend/src", "backend/prisma"],
}

# Allowed file extensions
allowed_extensions = [
    ".tsx",
    ".ts",
    ".js",
    ".jsx",
    ".json",
    ".md",
]  # Add any other extensions you want to include

# Output file where the whole combined codebase will be saved
output_file = "backend_codebase.txt"

# Clear the output file by opening it in write mode
with open(output_file, "w") as output:
    output.write("")  # Clear the content

    for codebase_name, codebase_dir in codebase_dirs.items():
        # Add separator marker between codebases (80 characters long)
        output.write(f'\n{"=" * 80}\n')  # Line separator for codebase
        output.write(f"# Codebase: {codebase_name} #\n")
        output.write(f'{"=" * 80}\n')  # Line separator after codebase name

        # Get the directories to include for the current codebase
        directories_to_include = include_dirs[codebase_name]

        for dir_to_include in directories_to_include:
            full_path = os.path.join(codebase_dir, dir_to_include)

            for root, dirs, files in os.walk(full_path):

                for file in files:
                    # Exclude files that are not in the allowed extensions
                    if not any(file.endswith(ext) for ext in allowed_extensions):
                        continue

                    file_path = os.path.join(root, file)

                    # Construct the relative path starting from the codebase name
                    relative_path = os.path.relpath(
                        file_path, codebase_dir
                    )  # get relative path from codebase
                    relative_path_with_codebase = os.path.join(
                        f"/{codebase_name}", relative_path
                    )  # prepend codebase name

                    try:
                        with open(file_path, "r") as f:
                            # Write the file path and content structured as desired
                            output.write(
                                f"File Path: {relative_path_with_codebase}\n\n"
                            )  # Added an extra newline for spacing
                            output.write(f.read())
                            output.write("\n")  # Add a newline after the content

                            # Add a longer file separator (80 characters long) between contents of different files
                            output.write(
                                f'{"-" * 80}\n'
                            )  # Line separator between files
                    except Exception as e:
                        output.write(
                            f"Error reading file: {relative_path_with_codebase} - {str(e)}\n"
                        )
                        print(f"Failed to read {relative_path_with_codebase}: {e}")
        
        # Add five lines of spacing between codebases
        output.write("\n\n\n\n\n")  # Five new lines for spacing between codebases