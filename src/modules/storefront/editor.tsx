import StyleVariables from '@/common/constants/styles';
import { Card, Col, Typography } from 'antd';
import Color from 'color';
import { NextRouter } from 'next/router';
import { assocPath, has, isNil, reduce } from 'ramda';
import { RuleObject } from 'rc-field-form/lib/interface';
import styled from 'styled-components';
import { ArweaveScope } from '../arweave/client';
import { ArweaveFile } from '../arweave/types';
import { PageMetaData, Storefront, StorefrontTheme } from './types';
import { putStorefront } from './put-storefront';
import { TrackingFunctionSignature } from '../../common/context/AnalyticsProvider';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const { Text, Title, Paragraph } = Typography;

export const PreviewButton = styled.div<{ textColor: string }>`
  height: 52px;
  background: ${(props) => props.color};
  color: ${(props) => props.textColor};
  width: fit-content;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  font-weight: 600;
`;

export const UploadedLogo = styled.img`
  height: 48px;
  width: 48px;
`;
export const UploadedBanner = styled.img`
  width: 100%;
`;

export const PreviewLink = styled.div`
  color: ${(props) => props.color};
  text-decoration: underline;
`;

type PrevTitleProps = {
  color: string;
  level: number;
  fontFamily: string;
};
export const PrevTitle = styled(Title)`
  &.ant-typography {
    font-family: '${({ fontFamily }: PrevTitleProps) => fontFamily}', sans;
    color: ${({ color }: PrevTitleProps) => color};
  }
`;

type PrevTextProps = {
  color: string;
  fontFamily: string;
};

export const PrevText = styled(Text)`
  &.ant-typography {
    font-family: '${({ fontFamily }: PrevTextProps) => fontFamily}', sans;
    color: ${({ color }: PrevTextProps) => color};
  }
`;
type PrevCardProps = {
  bgColor: string;
};

export const PrevCard = styled(Card)`
  &.ant-card {
    border-radius: 12px;
    height: 100%;
    display: flex;
    align-items: center;
    background-color: ${({ bgColor }: PrevCardProps) => bgColor};
  }
`;

export const PageCard = styled(Card)`
  margin: 70px 0 32px 0;
`;

export const PrevCol = styled(Col)`
  margin: 0 0 24px 0;
`;

export interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

/// Half reverse-engineered, mostly to avoid use of any
export interface AntdFile {
  uid: string;
  name: string;
  type: string;
  size: number;
  percent?: number;
  status?: 'uploading' | 'done' | 'error' | 'removed';
  response: ArweaveFile;
  xhr?: unknown;
}

export type FileInput = (ArweaveFile & { file?: undefined }) | AntdFile;

export const popFile = (f: FileInput): ArweaveFile & { file?: undefined } => {
  if (has<'response'>('response', f)) {
    return f.response;
  } else {
    return f;
  }
};

export const reduceFieldData = (data: FieldData[]) =>
  reduce<FieldData, Record<string, any>>(
    (acc, data) => assocPath(data.name instanceof Array ? data.name : [data.name], data.value, acc),
    {},
    data
  );

export interface StorefrontEditorProps {}

export const validateSubdomainUniqueness = (
  ar: ArweaveScope,
  allowPubkey?: string
): ((rule: RuleObject, subdomain: string | null | undefined) => Promise<void>) => {
  return async (_, subdomain) => {
    const storefront = await ar.storefront.find('holaplex:metadata:subdomain', subdomain ?? '');

    if (isNil(storefront)) return;
    if (allowPubkey && storefront.pubkey === allowPubkey) return;

    throw new Error('The subdomain is already in use.  Please pick another.');
  };
};

export const submitCallback = ({
  router,
  solana,
  values,
  setSubmitting,
  onSuccess,
  onError,
  trackingFunction,
}: {
  router: NextRouter;
  solana: WalletContextState | undefined;
  values: any;
  setSubmitting: (val: boolean) => void;
  onSuccess: (domain: string) => void;
  onError: (e: string | undefined) => void;
  trackingFunction: () => void;
}): (() => Promise<void>) => {
  return async () => {
    try {
      setSubmitting(true);

      const { theme, meta, subdomain, integrations } = values;
      const domain = `${subdomain}.holaplex.com`;

      const logo = popFile(theme.logo[0]);
      const banner = popFile(theme.banner[0]);
      const favicon = popFile(meta.favicon[0]);

      const storefront: Storefront = {
        theme: {
          ...(theme as StorefrontTheme<unknown>),
          logo,
          banner: undefined,
        },
        meta: {
          ...(meta as PageMetaData<unknown>),
          favicon,
        },
        subdomain,
        pubkey: solana?.publicKey?.toBase58() ?? '',
        integrations,
      };

      if (banner?.url) {
        storefront.theme.banner = banner;
      }

      await putStorefront({
        solana,
        storefront,
        onProgress: (s) => console.log(s),
        onError,
      });

      onSuccess(domain);

      router.push('/').then(() => {
        trackingFunction();
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };
};

export const getTextColor = (color: Parameters<typeof Color>[0]) =>
  new Color(color).isDark() ? StyleVariables.colors.buttonText : StyleVariables.colors.text;
