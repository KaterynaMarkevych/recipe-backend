import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss"; // Стилі для кнопки

const Button = ({
  variant = "primary",
  size = "normall",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        {
          [styles[size]]: size,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
