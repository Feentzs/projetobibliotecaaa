// Atualiza o atributo 'value' em tempo real para manter a label no topo
document.addEventListener('DOMContentLoaded', function() {
    const inputElements = document.querySelectorAll('.input-contain input');
    
    inputElements.forEach(input => {
        // Atualiza a cada tecla pressionada
        input.addEventListener('keyup', () => {
            input.setAttribute('value', input.value);
        });
    });
});