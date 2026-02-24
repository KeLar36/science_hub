export const theme = {
	purple: '#6a5acd',
	lightPurple: '#f3f0ff',
	darkPurple: '#483d8b',
	white: '#ffffff',
	gray: '#f8f9fa',
	error: '#d32f2f',
	success: '#2e7d32'
 };
 
 export const commonStyles = {
	container: { 
	  display: 'flex', 
	  justifyContent: 'center', 
	  alignItems: 'center', 
	  height: '100vh', 
	  backgroundColor: theme.gray 
	},
	card: { 
	  background: theme.white, 
	  padding: '40px', 
	  borderRadius: '12px', 
	  boxShadow: '0 4px 20px rgba(106, 90, 205, 0.1)', 
	  width: '350px', 
	  border: `1px solid ${theme.lightPurple}`,
	  textAlign: 'center'
	},
	input: { 
	  width: '100%', 
	  padding: '12px', 
	  margin: '10px 0', 
	  borderRadius: '8px', 
	  border: `1px solid ${theme.lightPurple}`, 
	  boxSizing: 'border-box',
	  outlineColor: theme.purple 
	},
	button: { 
	  width: '100%', 
	  padding: '12px', 
	  backgroundColor: theme.purple, 
	  color: 'white', 
	  border: 'none', 
	  borderRadius: '8px', 
	  cursor: 'pointer', 
	  fontWeight: '600', 
	  marginTop: '10px',
	  transition: '0.3s'
	},
	link: {
	  display: 'block',
	  marginTop: '15px',
	  color: theme.purple,
	  textDecoration: 'none',
	  fontSize: '14px'
	}
 };