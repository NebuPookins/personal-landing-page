import React from 'react';

interface MenuItem {
  label: string;
  slide: string; // Original slide ID for reference
  href: string;  // Constructed href for the anchor tag
}

interface MenuSlideProps {
  id: string;
  bg: string;
  title?: string; // Title is from item.text, which is optional
  items?: MenuItem[];
}

const MenuSlide: React.FC<MenuSlideProps> = ({ id, bg, title, items }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: bg }}
    >
      {title && <h2>{title}</h2>}
      {items && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MenuSlide;
