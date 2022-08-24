import { get } from 'lodash'

function selectFile() {
    return new Promise((resolve) => {
        let $input = document.createElement('input')
        $input.type = 'file'
        $input.style.display = 'none'

        $input.addEventListener('change', (event) => {
            let file = get(event, 'target.files[0]')
            resolve(file)
            document.body.removeChild($input)
        })
        document.body.append($input)
        $input.click()
    })
}

export default selectFile