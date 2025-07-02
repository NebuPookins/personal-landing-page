import React from 'react';

interface MenuItem {
  label: string;
  href: string;  // Constructed href for the anchor tag
}

interface MenuSlideProps {
  id: string;
  items: MenuItem[];
}

const MenuSlide: React.FC<MenuSlideProps> = ({ id, items }) => {
  return (
    <section
      id={id}
      className="slide"
      style={{ background: "blue" }}
    >
      <h2>Did you know I'm into all of these things?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MenuSlide;
