import { 
  Heading, Text, Button, Card, List, Divider, Spacer, Checkbox 
} from '../components/basic'
import { 
  Container, FlexContainer, GridContainer, SimpleContainer, PositionedElement 
} from '../components/containers'
import {
  HeroSection, HeroVideo, Slider, SpeakerCard, SpeakersSection, ScheduleSection, AboutSection, PricingPlans, FAQSection, Navigation, CountdownTimer, ProgressCircleStats, HTMLContent
} from '../components/advanced'
import FeedbackForm from '../components/advanced/FeedbackForm'
import ImageSimple from '../components/advanced/ImageSimple'

// Enhanced config with multiple components, categories, and icons
export const config = {
  categories: {
    // Basic Elements Category
    basic: {
      title: "Basic Elements",
      icon: "fa-solid fa-font",
      defaultExpanded: true,
      components: ["Heading", "Text", "Button", "Checkbox", "Divider", "Spacer"],
      subcategories: {
        typography: {
          title: "Typography",
          icon: "fa-solid fa-text-width",
          components: ["Heading", "Text"]
        },
        interactive: {
          title: "Interactive",
          icon: "fa-solid fa-hand-pointer",
          components: ["Button", "Checkbox"]
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
      components: ["HeroSection", "HeroVideo", "Slider", "Image", "SpeakerCard", "SpeakersSection", "ScheduleSection", "AboutSection", "PricingPlans", "FAQSection", "Navigation", "CountdownTimer", "ProgressCircleStats", "HTMLContent", "FeedbackForm"],
      subcategories: {
        sections: {
          title: "Sections",
          icon: "fa-solid fa-window-maximize",
          components: ["HeroSection", "HeroVideo", "AboutSection", "PricingPlans", "FAQSection", "HTMLContent", "FeedbackForm"]
        },
        media: {
          title: "Media",
          icon: "fa-solid fa-image",
          components: ["Image", "Slider"]
        },
        interactive: {
          title: "Interactive",
          icon: "fa-solid fa-hand-pointer",
          components: ["SpeakerCard", "SpeakersSection", "ScheduleSection", "Navigation", "CountdownTimer", "ProgressCircleStats"]
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
            { label: 'H4', value: 4 },
            { label: 'H5', value: 5 },
            { label: 'H6', value: 6 }
          ]
        },
        size: {
          type: 'select' as const,
          label: 'Size',
          options: [
            { label: 'XXXL (4rem)', value: 'XXXL' },
            { label: 'XXL (3.5rem)', value: 'XXL' },
            { label: 'XL (3rem)', value: 'XL' },
            { label: 'L (2.5rem)', value: 'L' },
            { label: 'M (2rem)', value: 'M' },
            { label: 'S (1.5rem)', value: 'S' },
            { label: 'XS (1.25rem)', value: 'XS' }
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
        size: 'M' as const,
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
    Checkbox: {
      label: "☑️ Checkbox",
      fields: {
        label: { type: "text", label: "Label" },
        checked: { 
          type: "radio", 
          label: "State",
          options: [
            { label: "Unchecked", value: "false" },
            { label: "Checked", value: "true" }
          ]
        },
      },
      defaultProps: {
        label: "Check this option",
        checked: "false"
      },
      render: Checkbox
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
        'column-0': ['Text', 'Button', 'Heading', 'Card', 'List', 'Checkbox', 'Divider', 'Spacer', 'SpeakerCard'],
        'column-1': ['Text', 'Button', 'Heading', 'Card', 'List', 'Checkbox', 'Divider', 'Spacer', 'SpeakerCard'],
        'column-2': ['Text', 'Button', 'Heading', 'Card', 'List', 'Checkbox', 'Divider', 'Spacer', 'SpeakerCard'],
        'column-3': ['Text', 'Button', 'Heading', 'Card', 'List', 'Checkbox', 'Divider', 'Spacer', 'SpeakerCard'],
        'column-4': ['Text', 'Button', 'Heading', 'Card', 'List', 'Checkbox', 'Divider', 'Spacer', 'SpeakerCard'],
        'column-5': ['Text', 'Button', 'Heading', 'Card', 'List', 'Checkbox', 'Divider', 'Spacer', 'SpeakerCard']
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
        title: { 
          type: 'text' as const,
          label: 'Event Title',
          contentEditable: true
        },
        subtitle: { 
          type: 'textarea' as const,
          label: 'Location | Date',
          contentEditable: true
        },
        buttons: {
          type: 'array' as const,
          label: 'Buttons',
          arrayFields: {
            text: { 
              type: 'text' as const,
              label: 'Button Text',
              contentEditable: true
            },
            link: { 
              type: 'text' as const,
              label: 'Button Link (URL)'
            },
            color: { 
              type: 'text' as const,
              label: 'Button Color (hex code)',
              placeholder: '#6938EF'
            },
            textColor: {
              type: 'select' as const,
              label: 'Button Text Color',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Black', value: 'black' },
                { label: 'Blue', value: '#007bff' },
                { label: 'Green', value: '#28a745' },
                { label: 'Red', value: '#dc3545' },
                { label: 'Orange', value: '#fd7e14' },
                { label: 'Yellow', value: '#ffc107' }
              ]
            },
            size: {
              type: 'select' as const,
              label: 'Button Size',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' }
              ]
            }
          }
        },
        backgroundImage: { 
          type: 'text' as const,
          label: 'Background Image URL'
        },
        backgroundColor: { 
          type: 'text' as const,
          label: 'Background Color (fallback)'
        },
        textColor: { 
          type: 'select' as const,
          label: 'Text Color',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Blue', value: '#007bff' },
            { label: 'Green', value: '#28a745' },
            { label: 'Purple', value: '#8b5cf6' },
            { label: 'Red', value: '#dc3545' },
            { label: 'Orange', value: '#fd7e14' },
            { label: 'Yellow', value: '#ffc107' }
          ]
        },
        height: { 
          type: 'select' as const,
          label: 'Section Height',
          options: [
            { label: 'Small (300px)', value: '300px' },
            { label: 'Medium (400px)', value: '400px' },
            { label: 'Large (500px)', value: '500px' },
            { label: 'Extra Large (600px)', value: '600px' },
            { label: 'Full Screen (100vh)', value: '100vh' }
          ]
        },
        alignment: {
          type: 'select' as const,
          label: 'Content Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        overlayOpacity: {
          type: 'select' as const,
          label: 'Background Overlay Opacity',
          options: [
            { label: 'None (0)', value: 0 },
            { label: 'Light (0.2)', value: 0.2 },
            { label: 'Medium (0.4)', value: 0.4 },
            { label: 'Dark (0.6)', value: 0.6 },
            { label: 'Very Dark (0.8)', value: 0.8 }
          ]
        },
        titleSize: {
          type: 'select' as const,
          label: 'Title Size',
          options: [
            { label: 'Small (2rem)', value: '2rem' },
            { label: 'Medium (2.5rem)', value: '2.5rem' },
            { label: 'Large (3rem)', value: '3rem' },
            { label: 'Extra Large (3.5rem)', value: '3.5rem' },
            { label: 'Huge (4rem)', value: '4rem' }
          ]
        },
        subtitleSize: {
          type: 'select' as const,
          label: 'Subtitle Size',
          options: [
            { label: 'Small (1rem)', value: '1rem' },
            { label: 'Medium (1.125rem)', value: '1.125rem' },
            { label: 'Large (1.25rem)', value: '1.25rem' },
            { label: 'Extra Large (1.5rem)', value: '1.5rem' }
          ]
        },
        buttonColor: {
          type: 'text' as const,
          label: 'Button Color (hex code)'
        },
        buttonTextColor: {
          type: 'select' as const,
          label: 'Button Text Color',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Blue', value: '#007bff' },
            { label: 'Green', value: '#28a745' }
          ]
        },
        buttonSpacing: {
          type: 'select' as const,
          label: 'Button Spacing',
          options: [
            { label: 'Small (8px)', value: '8px' },
            { label: 'Medium (12px)', value: '12px' },
            { label: 'Large (16px)', value: '16px' },
            { label: 'Extra Large (24px)', value: '24px' }
          ]
        }
      },
      defaultProps: {
        title: 'Event Title',
        subtitle: 'Location | Date',
        buttons: [
          {
            text: 'Register Now',
            link: '#register',
            color: '#6938EF',
            textColor: 'white',
            size: 'large'
          }
        ],
        backgroundColor: '#1a1a1a',
        textColor: 'white' as const,
        backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        height: '500px' as const,
        alignment: 'center' as const,
        overlayOpacity: 0.4,
        titleSize: '3.5rem',
        subtitleSize: '1.25rem',
        buttonSpacing: '12px' as const
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
    },
    SpeakerCard: {
      label: "👤 Speaker Card",
      fields: {
        photo: {
          type: 'text' as const,
          label: 'Photo URL',
          placeholder: 'https://example.com/photo.jpg',
          contentEditable: true
        },
        uploadedImage: {
          type: 'text' as const,
          label: 'Uploaded Image (File Path)',
          placeholder: 'File path will appear here after upload'
        },
        name: {
          type: 'text' as const,
          label: 'Name',
          contentEditable: true
        },
        designation: {
          type: 'text' as const,
          label: 'Designation',
          contentEditable: true
        }
      },
      defaultProps: {
        photo: 'https://picsum.photos/413/165?random=1',
        uploadedImage: null,
        name: 'Alex Thompson',
        designation: 'Senior Developer'
      },
      render: SpeakerCard
    },
    SpeakersSection: {
      label: "👥 Speakers Section",
      fields: {
        speakers: {
          type: 'array' as const,
          label: 'Speakers',
          arrayFields: {
            name: {
              type: 'text' as const,
              label: 'Name'
            },
            title: {
              type: 'text' as const,
              label: 'Title/Position'
            },
            image: {
              type: 'text' as const,
              label: 'Image URL',
              placeholder: 'https://example.com/photo.jpg'
            }
          }
        },
        backgroundColor: {
          type: 'text' as const,
          label: 'Background Color',
          placeholder: '#ffffff'
        },
        padding: {
          type: 'text' as const,
          label: 'Padding',
          placeholder: '4rem 2rem'
        },
        gap: {
          type: 'text' as const,
          label: 'Gap Between Cards',
          placeholder: '2rem'
        }
      },
      defaultProps: {
        speakers: [
          {
            name: 'Dr. Jane Doe',
            title: 'Professor at X University',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop&crop=face'
          },
          {
            name: 'Dr. John Smith',
            title: 'Research Director',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop&crop=face'
          },
          {
            name: 'Dr. Sarah Wilson',
            title: 'Industry Expert',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop&crop=face'
          }
        ],
        backgroundColor: '#ffffff',
        padding: '0 2rem',
        gap: '2rem'
      },
      render: SpeakersSection
    },
    ScheduleSection: {
      label: "📅 Schedule Section",
      fields: {
        sessions: {
          type: 'array' as const,
          label: 'Sessions',
          arrayFields: {
            title: {
              type: 'text' as const,
              label: 'Session Title'
            },
            time: {
              type: 'text' as const,
              label: 'Time (e.g., 08:00 AM - 09:00 AM)'
            },
            room: {
              type: 'text' as const,
              label: 'Room/Location'
            },
            mode: {
              type: 'text' as const,
              label: 'Mode (e.g., In-Person, Online)'
            },
            description: {
              type: 'text' as const,
              label: 'Description'
            },
            icon: {
              type: 'text' as const,
              label: 'Icon (emoji or image URL)',
              placeholder: '🎯'
            }
          }
        },
        buttonText: {
          type: 'text' as const,
          label: 'Button Text',
          placeholder: 'View Full Schedule',
          contentEditable: true
        },
        backgroundColor: {
          type: 'text' as const,
          label: 'Background Color',
          placeholder: '#f8f9fa'
        },
        padding: {
          type: 'text' as const,
          label: 'Padding',
          placeholder: '2rem'
        },
        gap: {
          type: 'text' as const,
          label: 'Gap Between Sessions',
          placeholder: '1rem'
        }
      },
      defaultProps: {
        sessions: [
          {
            title: 'Welcome presentation',
            time: '08:00 AM - 09:00 AM',
            room: 'Room A',
            mode: 'In-Person',
            description: 'Brief overview and a warm welcome to all participants. This session will cover the agenda, housekeeping rules, and introduce the keynote speakers.',
            icon: '🎯'
          },
          {
            title: 'Poster presentation',
            time: '08:00 AM - 09:00 AM',
            room: 'Room B',
            mode: 'In-Person',
            description: 'Brief overview of posters and topics. Participants will have the opportunity to view research posters and interact with presenters.',
            icon: '🎯'
          },
          {
            title: 'Keynote Address',
            time: '09:00 AM - 10:00 AM',
            room: 'Main Hall',
            mode: 'In-Person',
            description: 'Inspirational keynote presentation by industry leaders covering the latest trends and future directions in the field.',
            icon: '🎤'
          },
          {
            title: 'Coffee Break',
            time: '10:00 AM - 10:30 AM',
            room: 'Lobby',
            mode: 'In-Person',
            description: 'Networking opportunity with refreshments and informal discussions.',
            icon: '☕'
          },
          {
            title: 'Panel Discussion',
            time: '10:30 AM - 11:30 AM',
            room: 'Main Hall',
            mode: 'In-Person',
            description: 'Expert panel discussion on current challenges and opportunities in the industry. Q&A session included.',
            icon: '👥'
          },
         
        ],
        buttonText: 'View Full Schedule',
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        gap: '1rem'
      },
      render: ScheduleSection
    },
         AboutSection: {
           label: "ℹ️ About Section",
           fields: {
             leftTitle: {
               type: 'text' as const,
               label: 'Left Column Title',
               placeholder: 'Our Mission',
               contentEditable: true
             },
             leftText: {
               type: 'text' as const,
               label: 'Left Column Text',
               placeholder: 'We are dedicated to providing innovative solutions...',
               contentEditable: true
             },
             rightTitle: {
               type: 'text' as const,
               label: 'Right Column Title',
               placeholder: 'Our Vision',
               contentEditable: true
             },
             rightText: {
               type: 'text' as const,
               label: 'Right Column Text',
               placeholder: 'To be the leading provider of cutting-edge technology...',
               contentEditable: true
             },
             backgroundColor: {
               type: 'text' as const,
               label: 'Background Color',
               placeholder: '#ffffff'
             },
             textColor: {
               type: 'text' as const,
               label: 'Text Color',
               placeholder: '#333333'
             },
             padding: {
               type: 'text' as const,
               label: 'Padding',
               placeholder: '3rem 2rem'
             }
           },
           defaultProps: {
             leftTitle: 'Our Mission',
             leftText: 'We are dedicated to providing innovative solutions that help our clients achieve their goals and drive success in their respective industries.',
             rightTitle: 'Our Vision',
             rightText: 'To be the leading provider of cutting-edge technology solutions, empowering businesses to thrive in the digital age.',
             backgroundColor: '#ffffff',
             textColor: '#333333',
             padding: '3rem 2rem'
           },
           render: AboutSection
         },
         PricingPlans: {
           label: "💰 Pricing Plans",
           fields: {
             plans: {
               type: 'array' as const,
               label: 'Pricing Plans',
               arrayFields: {
                 icon: {
                   type: 'text' as const,
                   label: 'Icon (emoji)',
                   placeholder: '⚡'
                 },
                 title: {
                   type: 'text' as const,
                   label: 'Plan Title',
                   placeholder: 'Basic plan',
                   contentEditable: true
                 },
                 price: {
                   type: 'text' as const,
                   label: 'Price',
                   placeholder: '$10',
                   contentEditable: true
                 },
                 billingNote: {
                   type: 'text' as const,
                   label: 'Billing Note',
                   placeholder: 'Billed annually.',
                   contentEditable: true
                 },
                 features: {
                   type: 'array' as const,
                   label: 'Features',
                   arrayFields: {
                     feature: {
                       type: 'text' as const,
                       label: 'Feature',
                       placeholder: 'Access to all basic features',
                       contentEditable: true
                     }
                   }
                 },
                 buttonText: {
                   type: 'text' as const,
                   label: 'Button Text',
                   placeholder: 'Get started',
                   contentEditable: true
                 }
               }
             },
             backgroundColor: {
               type: 'text' as const,
               label: 'Background Color',
               placeholder: '#f3e8ff'
             },
             padding: {
               type: 'text' as const,
               label: 'Padding',
               placeholder: '6rem 2rem'
             }
           },
           defaultProps: {
             plans: [
               {
                 id: 'basic',
                 icon: '⚡',
                 title: 'Basic plan',
                 price: '$10',
                 billingNote: 'Billed annually.',
                 features: [
                   'Access to all basic features',
                   'Basic reporting and analytics',
                   'Up to 10 individual users',
                   '20 GB individual data',
                   'Basic chat and email support'
                 ],
                 buttonText: 'Get started'
               },
               {
                 id: 'business',
                 icon: '📊',
                 title: 'Business plan',
                 price: '$20',
                 billingNote: 'Billed annually.',
                 features: [
                   '200+ integrations',
                   'Advanced reporting and analytics',
                   'Up to 20 individual users',
                   '40 GB individual data',
                   'Priority chat and email support'
                 ],
                 buttonText: 'Get started'
               },
               {
                 id: 'enterprise',
                 icon: '🏢',
                 title: 'Enterprise plan',
                 price: '$40',
                 billingNote: 'Billed annually.',
                 features: [
                   'Advanced custom fields',
                   'Audit log and data history',
                   'Unlimited individual users',
                   'Unlimited individual data',
                   'Personalized + priority service'
                 ],
                 buttonText: 'Get started'
               }
             ],
             backgroundColor: '#f3e8ff',
             padding: '6rem 2rem'
           },
           render: PricingPlans
         },
         FAQSection: {
           label: "❓ FAQ Section",
           fields: {
             title: {
               type: 'text' as const,
               label: 'Title',
               placeholder: 'Frequently asked questions',
               contentEditable: true
             },
             subtitle: {
               type: 'text' as const,
               label: 'Subtitle',
               placeholder: 'Everything you need to know about the product and billing.',
               contentEditable: true
             },
             faqs: {
               type: 'array' as const,
               label: 'FAQ Items',
               arrayFields: {
                 icon: {
                   type: 'text' as const,
                   label: 'Icon (emoji)',
                   placeholder: '❤️'
                 },
                 question: {
                   type: 'text' as const,
                   label: 'Question',
                   placeholder: 'Is there a free trial available?',
                   contentEditable: true
                 },
                 answer: {
                   type: 'textarea' as const,
                   label: 'Answer',
                   placeholder: 'Yes, you can try us for free for 30 days...',
                   contentEditable: true
                 }
               }
             },
             ctaText: {
               type: 'text' as const,
               label: 'Call to Action Text',
               placeholder: 'Still have questions? Can\'t find the answer you\'re looking for? Please chat to our friendly team.',
               contentEditable: true
             },
             buttonText: {
               type: 'text' as const,
               label: 'Button Text',
               placeholder: 'Get in touch',
               contentEditable: true
             },
             backgroundColor: {
               type: 'text' as const,
               label: 'Background Color',
               placeholder: '#f8fafc'
             },
             padding: {
               type: 'text' as const,
               label: 'Padding',
               placeholder: '6rem 2rem'
             }
           },
           defaultProps: {
             title: 'Frequently asked questions',
             subtitle: 'Everything you need to know about the product and billing.',
             faqs: [
               {
                 id: '1',
                 icon: '❤️',
                 question: 'Is there a free trial available?',
                 answer: 'Yes, you can try us for free for 30 days. If you want, we\'ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.'
               },
               {
                 id: '2',
                 icon: '🔄',
                 question: 'Can I change my plan later?',
                 answer: 'Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.'
               },
               {
                 id: '3',
                 icon: '🚫',
                 question: 'What is your cancellation policy?',
                 answer: 'We understand that things change. You can cancel your plan at any time and we\'ll refund you the difference already paid.'
               },
               {
                 id: '4',
                 icon: '📄',
                 question: 'Can other info be added to an invoice?',
                 answer: 'Absolutely. You can add any additional information you need to your invoices, including custom fields and notes.'
               },
               {
                 id: '5',
                 icon: '⚡',
                 question: 'How does billing work?',
                 answer: 'We offer flexible billing options. You can choose monthly or annual billing, and we accept all major credit cards and payment methods.'
               },
               {
                 id: '6',
                 icon: '✉️',
                 question: 'How do I change my account email?',
                 answer: 'You can update your account email anytime from your account settings. We\'ll send a confirmation email to verify the change.'
               }
             ],
             ctaText: 'Still have questions? Can\'t find the answer you\'re looking for? Please chat to our friendly team.',
             buttonText: 'Get in touch',
             backgroundColor: '#f8fafc',
             padding: '6rem 2rem'
           },
          render: FAQSection
        },
    FeedbackForm: {
      label: "📝 Feedback Form",
      fields: {
        title: {
          type: 'text' as const,
          label: 'Form Title',
          placeholder: 'Customer Feedback',
          contentEditable: true
        },
        subtitle: {
          type: 'text' as const,
          label: 'Form Subtitle',
          placeholder: 'We value your opinion! Please take a moment to share your thoughts about our event.',
          contentEditable: true
        },
        backgroundColor: {
          type: 'text' as const,
          label: 'Background Color',
          placeholder: '#ffffff'
        },
        textColor: {
          type: 'text' as const,
          label: 'Text Color',
          placeholder: '#333333'
        },
        padding: {
          type: 'select' as const,
          label: 'Padding',
          options: [
            { label: 'Small (1rem)', value: '1rem' },
            { label: 'Medium (2rem)', value: '2rem' },
            { label: 'Large (3rem)', value: '3rem' },
            { label: 'Extra Large (4rem)', value: '4rem' }
          ]
        }
      },
      defaultProps: {
        title: 'Customer Feedback',
        subtitle: 'We value your opinion! Please take a moment to share your thoughts about our event.',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        padding: '2rem'
      },
      render: FeedbackForm
    },
    Navigation: {
      label: "🧭 Navigation",
      fields: {
        logo: {
          type: 'text' as const,
          label: 'Logo URL',
          placeholder: 'https://example.com/logo.png',
          contentEditable: true
        },
        logoText: {
          type: 'text' as const,
          label: 'Logo Text',
          placeholder: 'Your Brand',
          contentEditable: true
        },
        menuItems: {
          type: 'text' as const,
          label: 'Menu Items',
          placeholder: 'About|/about,Speakers|/speakers,Schedule|/schedule,Information|/information,Contact|/contact,Register|/register',
          contentEditable: true
        },
        backgroundColor: {
          type: 'text' as const,
          label: 'Background Color',
          placeholder: '#ffffff'
        },
        textColor: {
          type: 'text' as const,
          label: 'Text Color',
          placeholder: '#333333'
        },
        logoColor: {
          type: 'text' as const,
          label: 'Logo Color',
          placeholder: '#333333'
        },
        linkColor: {
          type: 'text' as const,
          label: 'Link Color',
          placeholder: '#333333'
        },
        hoverColor: {
          type: 'text' as const,
          label: 'Hover Color',
          placeholder: '#007bff'
        },
        padding: {
          type: 'text' as const,
          label: 'Padding',
          placeholder: '1rem 2rem'
        },
        alignment: {
          type: 'select' as const,
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        }
      },
      defaultProps: {
        logo: 'https://via.placeholder.com/40x40/007bff/ffffff?text=L',
        logoText: 'EventPro',
        menuItems: 'About|/about,Speakers|/speakers,Schedule|/schedule,Information|/information,Contact|/contact,Register|/register',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        logoColor: '#333333',
        linkColor: '#333333',
        hoverColor: '#007bff',
        padding: '1rem 2rem',
        alignment: 'left'
      },
      render: Navigation
    },
    CountdownTimer: {
      label: "⏰ Countdown Timer",
      fields: {
        heading: {
          type: 'text' as const,
          label: 'Heading',
          placeholder: 'Abstract submission deadline in',
          contentEditable: true
        },
        targetDate: {
          type: 'text' as const,
          label: 'Target Date & Time',
          placeholder: '2024-12-31T23:59:59',
          contentEditable: true
        }
      },
      defaultProps: {
        heading: 'Abstract submission deadline in',
        targetDate: '2025-12-31T23:59:59'
      },
      render: CountdownTimer
    },
    ProgressCircleStats: {
      label: "📊 Progress Circle Stats",
      fields: {
        item1Value: {
          type: 'number' as const,
          label: 'Item 1 - Percentage (0-100)',
          min: 0,
          max: 100
        },
        item1Color: {
          type: 'text' as const,
          label: 'Item 1 - Color',
          placeholder: '#3b82f6'
        },
        item1Caption: {
          type: 'text' as const,
          label: 'Item 1 - Caption',
          placeholder: 'Found the event useful for their professional career development.',
          contentEditable: true
        },
        item2Value: {
          type: 'number' as const,
          label: 'Item 2 - Percentage (0-100)',
          min: 0,
          max: 100
        },
        item2Color: {
          type: 'text' as const,
          label: 'Item 2 - Color',
          placeholder: '#10b981'
        },
        item2Caption: {
          type: 'text' as const,
          label: 'Item 2 - Caption',
          placeholder: 'Reported that the congress met their educational goals and learning expectations.',
          contentEditable: true
        },
        item3Value: {
          type: 'number' as const,
          label: 'Item 3 - Percentage (0-100)',
          min: 0,
          max: 100
        },
        item3Color: {
          type: 'text' as const,
          label: 'Item 3 - Color',
          placeholder: '#f59e0b'
        },
        item3Caption: {
          type: 'text' as const,
          label: 'Item 3 - Caption',
          placeholder: 'Agreed that the information presented was well-balanced and supported by scientific evidence.',
          contentEditable: true
        }
      },
      defaultProps: {
        item1Value: 96.5,
        item1Color: '#3b82f6',
        item1Caption: 'Found the event useful for their professional career development.',
        item2Value: 97.4,
        item2Color: '#10b981',
        item2Caption: 'Reported that the congress met their educational goals and learning expectations.',
        item3Value: 99.3,
        item3Color: '#f59e0b',
        item3Caption: 'Agreed that the information presented was well-balanced and supported by scientific evidence.'
      },
      render: ProgressCircleStats
    },
    HeroVideo: {
      label: "🎬 Hero Video",
      fields: {
        videoUrl: {
          type: 'text' as const,
          label: 'Video URL',
          placeholder: 'https://example.com/video.mp4',
          contentEditable: true
        },
        title: {
          type: 'text' as const,
          label: 'Title',
          contentEditable: true
        },
        subtitle: {
          type: 'text' as const,
          label: 'Subtitle',
          contentEditable: true
        },
        buttonText: {
          type: 'text' as const,
          label: 'Button Text',
          contentEditable: true
        },
        buttonLink: {
          type: 'text' as const,
          label: 'Button Link',
          placeholder: '/register',
          contentEditable: true
        },
        backgroundColor: {
          type: 'text' as const,
          label: 'Background Color',
          placeholder: '#000000'
        },
        textColor: {
          type: 'text' as const,
          label: 'Text Color',
          placeholder: '#ffffff'
        },
        titleSize: {
          type: 'select' as const,
          label: 'Title Size',
          options: [
            { label: 'XXXL', value: 'XXXL' },
            { label: 'XXL', value: 'XXL' },
            { label: 'XL', value: 'XL' },
            { label: 'L', value: 'L' },
            { label: 'M', value: 'M' },
            { label: 'S', value: 'S' },
            { label: 'XS', value: 'XS' }
          ]
        },
        subtitleSize: {
          type: 'select' as const,
          label: 'Subtitle Size',
          options: [
            { label: 'XL', value: 'XL' },
            { label: 'L', value: 'L' },
            { label: 'M', value: 'M' },
            { label: 'S', value: 'S' },
            { label: 'XS', value: 'XS' }
          ]
        },
        buttonColor: {
          type: 'text' as const,
          label: 'Button Color',
          placeholder: '#007bff'
        },
        buttonTextColor: {
          type: 'text' as const,
          label: 'Button Text Color',
          placeholder: '#ffffff'
        },
        buttonSize: {
          type: 'select' as const,
          label: 'Button Size',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]
        },
        overlayOpacity: {
          type: 'text' as const,
          label: 'Overlay Opacity',
          placeholder: '0.4'
        },
        alignment: {
          type: 'select' as const,
          label: 'Text Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        height: {
          type: 'text' as const,
          label: 'Height',
          placeholder: '500px'
        }
      },
      defaultProps: {
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        title: 'Welcome to Our Event',
        subtitle: 'Join us for an amazing experience with industry leaders and innovative solutions',
        buttonText: 'Register Now',
        buttonLink: '/register',
        backgroundColor: '#000000',
        textColor: '#ffffff',
        titleSize: 'XL',
        subtitleSize: 'L',
        buttonColor: '#007bff',
        buttonTextColor: '#ffffff',
        buttonSize: 'medium',
        overlayOpacity: 0.4,
        alignment: 'center',
        height: '500px'
      },
      render: HeroVideo
    },
    HTMLContent: {
      label: "🌐 HTML Content",
      fields: {
        htmlContent: {
          type: 'textarea' as const,
          label: 'HTML Content',
          placeholder: '<div>Enter your HTML content here...</div>',
          rows: 10
        }
      },
      defaultProps: {
        htmlContent: '<div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 8px;"><h2>HTML Content</h2><p>Add your custom HTML content here.</p></div>'
      },
      render: HTMLContent
    }

  }
}
