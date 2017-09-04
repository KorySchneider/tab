## NOTE: depends on these (globally installed) npm packages:
# postcss-cli autoprefixer html-minifier

import subprocess

output_file = 'index.html'
output = '' # This will be the contents of output_file

def write(output):
    global output_file
    with open(output_file, 'r+') as f:
        f.truncate()
        f.write(output)
    f.close()

# Add HTML
with open('html.html', 'r') as html:
    output += html.read()
html.close()

# Add commands
with open('commands.js', 'r') as commands:
    output += '<script>'
    output += commands.read()
    output += '</script>'
commands.close()

# Add JS
with open('js.js', 'r') as js:
    output += '<script>'
    output += js.read()
    output += '</script>'
js.close()

# Add CSS
with open('css.css', 'r') as css:
    output += '<style>'
    output += css.read()
    output += '</style>'
css.close()

# Write
write(output)

# Minify
minify_command = 'html-minifier --collapse-boolean-attributes --collapse-whitespace --decode-entities --html5 --minify-css --minify-js --process-conditional-comments --remove-attribute-quotes --remove-comments --remove-empty-attributes --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --remove-tag-whitespace --sort-attributes --sort-class-name --trim-custom-fragments --use-short-doctype ' + output_file
mini_output = subprocess.run(minify_command.split(), stdout=subprocess.PIPE).stdout.decode('utf-8')
write(mini_output)
