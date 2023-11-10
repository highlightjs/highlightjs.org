import {
  IconDefinition,
  faCheck,
  faInfoCircle,
  faTimesCircle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';

import { classList } from '../utilities/cssClasses';
import styles from './alert.module.scss';

export enum AlertTypes {
  Note = 'note',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  type: AlertTypes;
}

const AlertIcons: Record<AlertTypes, IconDefinition> = {
  [AlertTypes.Note]: faInfoCircle,
  [AlertTypes.Success]: faCheck,
  [AlertTypes.Warning]: faTriangleExclamation,
  [AlertTypes.Danger]: faTimesCircle,
};

export const Alert = ({ children, className, title, type }: Props) => {
  return (
    <div
      className={classList([className, styles.alert, styles[`alert-${type}`]])}
      role="alert"
    >
      <div className={styles.icon}>
        <FontAwesomeIcon icon={AlertIcons[type]} fixedWidth />
      </div>
      <div>
        {title && <p className="font-bold">{title}</p>}
        <div className={styles.message}>{children}</div>
      </div>
    </div>
  );
};
