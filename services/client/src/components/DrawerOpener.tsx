import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';

type ReactNodeAsFunctionOpts = {
  /** Функция для открытия шуфлядки */
  show: (...args: any) => any;
  /** Функция для закрытия шуфлядки */
  hide: (...args: any) => any;
};

type ReactNodeAsFunction = (opts: ReactNodeAsFunctionOpts) => React.ReactNode;

interface Props {
  /** Функция в которую передается объект, как аргумент, с функциями show и hide,
   *  и возвращающий реакт-компонент, который непосредственно открывает саму шуфлядку
   *
   *  ({show}) => <Button onClick={show}>Открыть</Button>
   */
  opener: ReactNodeAsFunction;

  /** Функция в которую передается объект, как аргумент, с функциями show и hide, и
   *  возвращающий реакт-компонент с основным содержимым,
   *  который будет помещен в открытую шуфлядку
   *
   *  ({hide}) => <Form onClick={() => hide()}><div>Содержимое здесь</></Form>
   */
  content: ReactNodeAsFunction;

  /** [Опциональный: boolean | (setVisible) => React.ReactNode]
   *  В случае если Boolean(true), то он вернет кнопу <Button>Готово</Button>
   *
   *  В случае если функция, то в нее передастся объект, как аргумент,
   *  с функциями show и hide, и возвращающий реакт-компонент
   *  предназначенный для таких действий, как например,
   *  submit event или закрытия самой шуфлядки.
   *
   *  ({hide}) => <Button onClick={hide}>Закрыть</Button>
   */
  footer?: boolean | ReactNodeAsFunction;

  /** Объект с антовскими значениями для Drawer api
   *  https://ant.design/components/drawer/#API
   */
  drawerProps?: DrawerProps;
}

/**
 * Компонента рисует кнопку или иконку, при клике на которую открывается шуфлядка.
 * Это помогает упростить работу с шуфлядкой.
 *
 * @example
 *  import { IconDrawerController } from '../IconDrawerController';
 *
 *  <DrawerOpener
 *    opener={({ show }) => (
 *      <Button onClick={show}>
 *        Открыть
 *      </Button>
 *    )}
 *    content={({ hide }) => (
 *      <Form
 *        onFinish={(v) => {
 *          // ...some save logic
 *          hide();
 *        }}
 *      >
 *        Some content
 *      </Form>
 *    )}
 *    footer={({ hide })=>(
 *      <Button data-cy="cancel" onClick={hide}>
 *        Закрыть
 *      </Button>
 *    )}
 *    drawerProps={{ title: "Мой заголовок" }}
 *  />
 */
export function DrawerOpener(props: Props) {
  const [visible, setVisible] = useState(false);
  const { drawerProps, footer, content, opener } = props;

  const opts: ReactNodeAsFunctionOpts = {
    show: () => setVisible(true),
    hide: () => setVisible(false),
  };

  return (
    <div>
      <Drawer
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
        {...drawerProps}
      >
        {/* Drawer content*/}
        <div>{content(opts)}</div>

        {/* Drawer footer*/}
        {typeof footer === 'boolean' && footer ? (
          <div className="drawer__btns-bottom">
            <Button type="primary" onClick={() => setVisible(false)}>
              Ok
            </Button>
          </div>
        ) : typeof footer === 'function' ? (
          <div className="drawer__btns-bottom">{footer(opts)}</div>
        ) : null}
      </Drawer>
      {opener(opts)}
    </div>
  );
}
