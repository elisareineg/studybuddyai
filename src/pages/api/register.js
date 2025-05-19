import dynamo from '../../utils/dynamo';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    // Check if user already exists
    const existing = await dynamo.get({
      TableName: 'Users',
      Key: { email }
    }).promise();
    if (existing.Item) {
      return res.status(409).json({ error: 'User already exists' });
    }
    // Hash password and store user
    const hashedPassword = await bcrypt.hash(password, 10);
    await dynamo.put({
      TableName: 'Users',
      Item: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      }
    }).promise();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 