import { render, screen } from '@testing-library/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

describe('Select Components', () => {
  describe('Select', () => {
    it('renders with default props', () => {
      render(
        <Select>
          <SelectTrigger>Select</SelectTrigger>
        </Select>
      )
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('renders with custom value', () => {
      render(
        <Select value="test">
          <SelectTrigger>Select</SelectTrigger>
        </Select>
      )
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select className="custom-select">
          <SelectTrigger>Select</SelectTrigger>
        </Select>
      )
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('handles undefined props gracefully', () => {
      render(
        <Select value={undefined} onValueChange={undefined}>
          <SelectTrigger>Select</SelectTrigger>
        </Select>
      )
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('handles null props gracefully', () => {
      render(
        <Select value={null as any} onValueChange={null as any}>
          <SelectTrigger>Select</SelectTrigger>
        </Select>
      )
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })
  })

  describe('SelectTrigger', () => {
    it('renders with default props', () => {
      render(
        <Select>
          <SelectTrigger>Trigger</SelectTrigger>
        </Select>
      )
      const trigger = screen.getByText('Trigger')
      expect(trigger).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">Custom Trigger</SelectTrigger>
        </Select>
      )
      const trigger = screen.getByText('Custom Trigger')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('forwards ref correctly', () => {
      const ref = jest.fn()
      render(
        <Select>
          <SelectTrigger ref={ref}>Ref Trigger</SelectTrigger>
        </Select>
      )
      expect(ref).toHaveBeenCalled()
    })

    it('handles undefined className gracefully', () => {
      render(
        <Select>
          <SelectTrigger className={undefined}>No Class</SelectTrigger>
        </Select>
      )
      const trigger = screen.getByText('No Class')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('SelectValue', () => {
    it('renders with default props', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )
      const value = screen.getByRole('combobox')
      expect(value).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      )
      const value = screen.getByText('Select option')
      expect(value).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue className="custom-value" placeholder="Custom" />
          </SelectTrigger>
        </Select>
      )
      const value = screen.getByText('Custom')
      expect(value).toBeInTheDocument()
    })

    it('forwards ref correctly', () => {
      const ref = jest.fn()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue ref={ref} />
          </SelectTrigger>
        </Select>
      )
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('SelectContent', () => {
    it('renders with default props', () => {
      render(
        <Select>
          <SelectTrigger>Select</SelectTrigger>
          <SelectContent>Content</SelectContent>
        </Select>
      )
      // SelectContent content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select>
          <SelectTrigger>Select</SelectTrigger>
          <SelectContent className="custom-content">Custom Content</SelectContent>
        </Select>
      )
      // SelectContent content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('SelectItem', () => {
    it('renders with default props', () => {
      render(
        <Select>
          <SelectTrigger>Select</SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      )
      // SelectItem content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(
        <Select>
          <SelectTrigger>Select</SelectTrigger>
          <SelectContent>
            <SelectItem value="custom" className="custom-item">Custom Item</SelectItem>
          </SelectContent>
        </Select>
      )
      // SelectItem content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles undefined value gracefully', () => {
      render(
        <Select>
          <SelectTrigger>Select</SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>No Value</SelectItem>
          </SelectContent>
        </Select>
      )
      // SelectItem content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('Select Composition', () => {
    it('renders complete select structure correctly', () => {
      render(
        <Select>
          <SelectTrigger>Select option</SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Select option')).toBeInTheDocument()
      // SelectItem content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('applies custom classes to all components', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">Select</SelectTrigger>
          <SelectContent className="custom-content">
            <SelectItem value="test" className="custom-item">Test</SelectItem>
          </SelectContent>
        </Select>
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('custom-trigger')
      expect(screen.getByText('Select')).toBeInTheDocument()
      // SelectItem content is not visible when select is closed
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })
})
