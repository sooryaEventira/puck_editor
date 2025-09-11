import { 
  Heading, Text, Button, Card, List, Divider, Spacer 
} from '../components/basic'
import { 
  Container, FlexContainer, GridContainer, SimpleContainer, PositionedElement 
} from '../components/containers'
import { 
  HeroSection, Slider, Image 
} from '../components/advanced'
import ImageSimple from '../components/advanced/ImageSimple'

// Enhanced config with multiple components, categories, and icons
export const config = {
  categories: {
    // Basic Elements Category
    basic: {
      title: "Basic Elements",
      icon: "fa-solid fa-font",
      defaultExpanded: true,
      components: ["Heading", "Text", "Button", "Divider", "Spacer"],
      subcategories: {
        typography: {
          title: "Typography",
          icon: "fa-solid fa-text-width",
          components: ["Heading", "Text"]
        },
        interactive: {
          title: "Interactive",
          icon: "fa-solid fa-hand-pointer",
          components: ["Button"]
        },
        spacing: {
          title: "Spacing",
          icon: "fa-solid fa-arrows-vertical",
          components: ["Divider", "Spacer"]
        }
      }
    },
    // Layout & Containers Category
    layout: {
      title: "Layout & Containers",
      icon: "fa-solid fa-th-large",
      defaultExpanded: true,
      components: ["Container", "FlexContainer", "GridContainer", "SimpleContainer", "PositionedElement"],
      subcategories: {
        containers: {
          title: "Containers",
          icon: "fa-solid fa-square",
          components: ["Container", "SimpleContainer"]
        },
        flexbox: {
          title: "Flexbox",
          icon: "fa-solid fa-arrows-left-right",
          components: ["FlexContainer"]
        },
        grid: {
          title: "Grid",
          icon: "fa-solid fa-grid-3x3",
          components: ["GridContainer"]
        },
        positioning: {
          title: "Positioning",
          icon: "fa-solid fa-crosshairs",
          components: ["PositionedElement"]
        }
      }
    },
    // Content Blocks Category
    content: {
      title: "Content Blocks",
      icon: "fa-solid fa-cube",
      defaultExpanded: true,
      components: ["Card", "List"],
      subcategories: {
        cards: {
          title: "Cards",
          icon: "fa-solid fa-id-card",
          components: ["Card"]
        },
        lists: {
          title: "Lists",
          icon: "fa-solid fa-list",
          components: ["List"]
        }
      }
    },
    // Advanced Components Category
    advanced: {
      title: "Advanced Components",
      icon: "fa-solid fa-magic",
      defaultExpanded: false,
      components: ["HeroSection", "Slider", "Image"],
      subcategories: {
        sections: {
          title: "Sections",
          icon: "fa-solid fa-window-maximize",
          components: ["HeroSection"]
        },
        media: {
          title: "Media",
          icon: "fa-solid fa-image",
          components: ["Image", "Slider"]
        }
      }
    }
  },
  components: {
    Heading: {
      label: "📝 Heading",
      fields: {
        text: { type: 'text' as const },
        level: { 
          type: 'select' as const, 
          options: [
            { label: 'H1', value: 1 },
            { label: 'H2', value: 2 },
            { label: 'H3', value: 3 },
            { label: 'H4', value: 4 }
          ]
        },
        color: { 
          type: 'text' as const,
          label: 'Text Color (e.g., #ff0000, red, blue)'
        },
        align: {
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Justify', value: 'justify' }
          ]
        }
      },
      defaultProps: {
        text: 'Heading',
        level: 1,
        color: '#333',
        align: 'left' as const
      },
      render: Heading
    },
    Text: {
      label: "📄 Text",
      fields: {
        text: { type: 'textarea' as const },
        size: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (14px)', value: '14px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (18px)', value: '18px' }
          ]
        },
        color: { 
          type: 'text' as const,
          label: 'Text Color (e.g., #ff0000, red, blue)'
        },
        align: {
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Justify', value: 'justify' }
          ]
        }
      },
      defaultProps: {
        text: 'This is some sample text. You can edit this content using the Puck editor!',
        size: '16px',
        color: '#555',
        align: 'left' as const
      },
      render: Text
    },
    Button: {
      label: "👆 Button",
      fields: {
        text: { type: 'text' as const },
        variant: { 
          type: 'select' as const, 
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Success', value: 'success' },
            { label: 'Danger', value: 'danger' }
          ]
        },
        size: { 
          type: 'select' as const, 
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]
        },
        textColor: { 
          type: 'text' as const,
          label: 'Text Color (e.g., #ff0000, red, blue)'
        }
      },
      defaultProps: {
        text: 'Click me',
        variant: 'primary' as const,
        size: 'medium' as const,
        textColor: 'white'
      },
      render: Button
    },
    Card: {
      label: "🆔 Card",
      fields: {
        title: { type: 'text' as const },
        description: { type: 'textarea' as const },
        backgroundColor: { type: 'text' as const },
        titleColor: { 
          type: 'text' as const,
          label: 'Title Color (e.g., #ff0000, red, blue)'
        },
        textColor: { 
          type: 'text' as const,
          label: 'Text Color (e.g., #ff0000, red, blue)'
        }
      },
      defaultProps: {
        title: 'Card Title',
        description: 'This is a card component with a title and description. You can customize the background color and content.',
        backgroundColor: '#fff',
        titleColor: '#333',
        textColor: '#666'
      },
      render: Card
    },
    List: {
      label: "📋 List",
      fields: {
        items: { type: 'textarea' as const },
        type: { 
          type: 'select' as const, 
          options: [
            { label: 'Unordered List', value: 'ul' },
            { label: 'Ordered List', value: 'ol' }
          ]
        },
        textColor: { 
          type: 'text' as const,
          label: 'Text Color (e.g., #ff0000, red, blue)'
        }
      },
      defaultProps: {
        items: 'First item\nSecond item\nThird item',
        type: 'ul' as const,
        textColor: '#555'
      },
      render: List
    },
    Divider: {
      label: "➖ Divider",
      fields: {
        color: { 
          type: 'text' as const,
          label: 'Text Color (e.g., #ff0000, red, blue)'
        },
        thickness: { 
          type: 'select' as const, 
          options: [
            { label: 'Thin (1px)', value: '1px' },
            { label: 'Medium (2px)', value: '2px' },
            { label: 'Thick (3px)', value: '3px' }
          ]
        }
      },
      defaultProps: {
        color: '#ddd',
        thickness: '1px'
      },
      render: Divider
    },
    Spacer: {
      label: "↕️ Spacer",
      fields: {
        height: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (10px)', value: '10px' },
            { label: 'Medium (20px)', value: '20px' },
            { label: 'Large (40px)', value: '40px' },
            { label: 'Extra Large (60px)', value: '60px' }
          ]
        }
      },
      defaultProps: {
        height: '20px'
      },
      render: Spacer
    },
    Container: {
      label: "📦 Container",
      fields: {
        backgroundColor: { type: 'text' as const },
        padding: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (10px)', value: '10px' },
            { label: 'Medium (20px)', value: '20px' },
            { label: 'Large (30px)', value: '30px' },
            { label: 'Extra Large (40px)', value: '40px' }
          ]
        },
        layout: {
          type: 'select' as const,
          options: [
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Grid', value: 'grid' },
            { label: 'Centered', value: 'centered' }
          ]
        },
        gap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        }
      },
      defaultProps: {
        backgroundColor: 'transparent',
        padding: '20px',
        layout: 'vertical' as const,
        gap: '16px'
      },
      render: Container,
      acceptsChildren: true
    },
    FlexContainer: {
      label: "↔️ FlexContainer",
      fields: {
        direction: {
          type: 'select' as const,
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' },
            { label: 'Row Reverse', value: 'row-reverse' },
            { label: 'Column Reverse', value: 'column-reverse' }
          ]
        },
        justify: {
          type: 'select' as const,
          options: [
            { label: 'Flex Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'Flex End', value: 'flex-end' },
            { label: 'Space Between', value: 'space-between' },
            { label: 'Space Around', value: 'space-around' },
            { label: 'Space Evenly', value: 'space-evenly' }
          ]
        },
        align: {
          type: 'select' as const,
          options: [
            { label: 'Stretch', value: 'stretch' },
            { label: 'Flex Start', value: 'flex-start' },
            { label: 'Center', value: 'center' },
            { label: 'Flex End', value: 'flex-end' },
            { label: 'Baseline', value: 'baseline' }
          ]
        },
        gap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        },
        wrap: {
          type: 'select' as const,
          options: [
            { label: 'No Wrap', value: 'nowrap' },
            { label: 'Wrap', value: 'wrap' },
            { label: 'Wrap Reverse', value: 'wrap-reverse' }
          ]
        }
      },
      defaultProps: {
        direction: 'row' as const,
        justify: 'flex-start' as const,
        align: 'stretch' as const,
        gap: '16px',
        wrap: 'nowrap' as const
      },
      render: FlexContainer,
      acceptsChildren: true
    },
    
    GridContainer: {
      label: "🔲 GridContainer",
      fields: {
        columns: {
          type: 'select' as const,
          options: [
            { label: '1 Column', value: 1 },
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
            { label: '5 Columns', value: 5 },
            { label: '6 Columns', value: 6 }
          ]
        },
        gap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        },
        rowGap: {
          type: 'select' as const,
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (16px)', value: '16px' },
            { label: 'Large (24px)', value: '24px' },
            { label: 'Extra Large (32px)', value: '32px' }
          ]
        }
      },
      defaultProps: {
        columns: 2,
        gap: '16px',
        rowGap: '16px'
      },
      render: GridContainer,
      zones: {
        children: ['Text', 'Button', 'Heading', 'Card'], // ✅ move allowed components here
      },
    },
    SimpleContainer: {
      label: "📦 SimpleContainer",
      fields: {
        backgroundColor: { type: 'text' as const },
        padding: { 
          type: 'select' as const, 
          options: [
            { label: 'Small (10px)', value: '10px' },
            { label: 'Medium (20px)', value: '20px' },
            { label: 'Large (30px)', value: '30px' }
          ]
        }
      },
      defaultProps: {
        backgroundColor: '#f0f8ff',
        padding: '20px'
      },
      render: SimpleContainer,
      acceptsChildren: true
    },
    PositionedElement: {
      label: "🎯 PositionedElement",
      fields: {
        position: {
          type: 'select' as const,
          options: [
            { label: 'Static', value: 'static' },
            { label: 'Relative', value: 'relative' },
            { label: 'Absolute', value: 'absolute' },
            { label: 'Fixed', value: 'fixed' },
            { label: 'Sticky', value: 'sticky' }
          ]
        },
        top: { type: 'text' as const },
        left: { type: 'text' as const },
        right: { type: 'text' as const },
        bottom: { type: 'text' as const },
        zIndex: { type: 'text' as const }
      },
      defaultProps: {
        position: 'static' as const,
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        zIndex: 'auto'
      },
      render: PositionedElement,
      acceptsChildren: true
    },
    HeroSection: {
      label: "🪟 HeroSection",
      fields: {
        title: { type: 'text' as const },
        subtitle: { type: 'textarea' as const },
        buttonText: { type: 'text' as const },
        buttonLink: { type: 'text' as const },
        backgroundColor: { type: 'text' as const },
        textColor: { 
          type: 'select' as const,
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Blue', value: '#007bff' },
            { label: 'Green', value: '#28a745' }
          ]
        },
        backgroundImage: { type: 'text' as const },
        height: { 
          type: 'select' as const,
          options: [
            { label: 'Small (300px)', value: '300px' },
            { label: 'Medium (400px)', value: '400px' },
            { label: 'Large (500px)', value: '500px' },
            { label: 'Extra Large (600px)', value: '600px' }
          ]
        },
        alignment: {
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        }
      },
      defaultProps: {
        title: 'Welcome to Our Amazing Product',
        subtitle: 'Discover the future of web development with our innovative solutions and cutting-edge technology.',
        buttonText: 'Get Started',
        buttonLink: '#',
        backgroundColor: '#007bff',
        textColor: 'white' as const,
        backgroundImage: '',
        height: '400px' as const,
        alignment: 'center' as const
      },
      render: HeroSection
    },
    Slider: {
      label: "🖼️ Slider",
      fields: {
        slides: { 
          type: 'textarea' as const,
          label: 'Slide Content (one per line)'
        },
        autoplay: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        autoplaySpeed: { 
          type: 'select' as const,
          options: [
            { label: 'Fast (2s)', value: 2000 },
            { label: 'Normal (3s)', value: 3000 },
            { label: 'Slow (5s)', value: 5000 },
            { label: 'Very Slow (8s)', value: 8000 }
          ]
        },
        showDots: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        showArrows: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        height: { 
          type: 'select' as const,
          options: [
            { label: 'Small (300px)', value: '300px' },
            { label: 'Medium (400px)', value: '400px' },
            { label: 'Large (500px)', value: '500px' },
            { label: 'Extra Large (600px)', value: '600px' }
          ]
        },
        backgroundColor: { 
          type: 'select' as const,
          options: [
            { label: 'Light Gray', value: '#f8f9fa' },
            { label: 'Blue', value: '#007bff' },
            { label: 'Green', value: '#28a745' },
            { label: 'Purple', value: '#6f42c1' },
            { label: 'Orange', value: '#fd7e14' }
          ]
        }
      },
      defaultProps: {
        slides: 'Welcome to Slide 1\nThis is Slide 2\nAnd here is Slide 3',
        autoplay: true,
        autoplaySpeed: 3000,
        showDots: true,
        showArrows: true,
        height: '400px' as const,
        backgroundColor: '#f8f9fa' as const
      },
      render: Slider
    },
    Image: {
      label: "🖼️ Image",
      fields: {
        src: { 
          type: 'text' as const,
          label: 'Image URL'
        },
        alt: { 
          type: 'text' as const,
          label: 'Alt Text (for accessibility)'
        },
        width: { 
          type: 'select' as const,
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '100%', value: '100%' },
            { label: '75%', value: '75%' },
            { label: '50%', value: '50%' },
            { label: '25%', value: '25%' },
            { label: '300px', value: '300px' },
            { label: '400px', value: '400px' },
            { label: '500px', value: '500px' }
          ]
        },
        height: { 
          type: 'select' as const,
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '200px', value: '200px' },
            { label: '300px', value: '300px' },
            { label: '400px', value: '400px' },
            { label: '500px', value: '500px' }
          ]
        },
        borderRadius: { 
          type: 'select' as const,
          options: [
            { label: 'None', value: '0px' },
            { label: 'Small (4px)', value: '4px' },
            { label: 'Medium (8px)', value: '8px' },
            { label: 'Large (16px)', value: '16px' },
            { label: 'Round', value: '50%' }
          ]
        },
        objectFit: { 
          type: 'select' as const,
          options: [
            { label: 'Cover (fill)', value: 'cover' },
            { label: 'Contain (fit)', value: 'contain' },
            { label: 'Fill (stretch)', value: 'fill' },
            { label: 'Scale Down', value: 'scale-down' },
            { label: 'None', value: 'none' }
          ]
        },
        alignment: { 
          type: 'select' as const,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        showCaption: { 
          type: 'radio' as const,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        },
        caption: { 
          type: 'text' as const,
          label: 'Image Caption'
        }
      },
      defaultProps: {
        src: 'https://picsum.photos/400/300',
        alt: 'Image description',
        width: '100%' as const,
        height: 'auto' as const,
        borderRadius: '8px' as const,
        objectFit: 'cover' as const,
        alignment: 'center' as const,
        showCaption: false,
        caption: ''
      },
      render: ImageSimple
    }
  }
}
