const fs = require('fs');
const filePath = './src/screens/ProfileScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the logout button styles
const oldStyle = `  logoutButton: { backgroundColor: colors.error, marginHorizontal: 20, marginVertical: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },`;

const newStyle = `  logoutButton: { 
    backgroundColor: colors.error, 
    marginHorizontal: 20, 
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },`;

content = content.replace(oldStyle, newStyle);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Logout button styling improved!');
