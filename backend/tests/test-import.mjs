// Test simple d'import
console.log('📝 Test d\'import du service...\n');

try {
  const module = await import('./src/services/employee.service.js');
  console.log('✅ Import réussi !');
  console.log('Exports disponibles:', Object.keys(module));
  
  if (module.employeeService) {
    console.log('✅ employeeService trouvé');
    console.log('Méthodes:', Object.getOwnPropertyNames(Object.getPrototypeOf(module.employeeService)));
  } else {
    console.log('❌ employeeService NON trouvé');
  }
} catch (error) {
  console.error('❌ Erreur d\'import:', error.message);
  console.error('\nStack:', error.stack);
}