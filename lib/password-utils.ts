import bcrypt from 'bcryptjs'
import { config } from './config'

export class PasswordManager {
  private static instance: PasswordManager

  static getInstance(): PasswordManager {
    if (!PasswordManager.instance) {
      PasswordManager.instance = new PasswordManager()
    }
    return PasswordManager.instance
  }

  async hashPassword(password: string): Promise<string> {
    try {
      // Validate password strength
      this.validatePassword(password)
      
      // Hash password with configured rounds
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.rounds)
      
      return hashedPassword
    } catch (error) {
      console.error('Error hashing password:', error)
      throw new Error('Failed to hash password')
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword)
      return isValid
    } catch (error) {
      console.error('Error verifying password:', error)
      return false
    }
  }

  private validatePassword(password: string): void {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const errors: string[] = []

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`)
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number')
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character')
    }

    if (errors.length > 0) {
      throw new Error(`Password validation failed: ${errors.join(', ')}`)
    }
  }

  generateSecurePassword(): string {
    const length = 16
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    
    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)] // number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)] // special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  async hashDefaultPassword(): Promise<string> {
    const defaultPassword = 'Admin@123456'
    return await this.hashPassword(defaultPassword)
  }
}

export const passwordManager = PasswordManager.getInstance()
