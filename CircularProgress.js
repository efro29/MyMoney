    import React from 'react';
    import { View, Text, StyleSheet } from 'react-native';
    import { Svg, Circle } from 'react-native-svg';
    import Icon from 'react-native-vector-icons/FontAwesome'; // Importando o FontAwesome para ícones

    const CircularProgress = ({ percent = 0, size = 120, strokeWidth = 10, color = '#4CAF50', backgroundColor = '#e6e6e6' ,ico}) => {
      const radius = (size - strokeWidth) / 2; // Calcula o raio
      const circumference = 2 * Math.PI * radius; // Comprimento total do círculo
      const strokeDashoffset = circumference - (percent / 100) * circumference; // Calcula o progresso com base no percentual

      return (
        <View style={styles.container}>
          <Svg width={size} height={size}>
            {/* Fundo do círculo */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Círculo de progresso */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`} // Inicia o progresso no topo
            />
          </Svg>
          {/* Texto central */}
          <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Icon name={ico} size={30} color="#493d54" />
            <Text style={styles.text}>{`${Math.round(percent)}%`}</Text>
          </View>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      center: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#493d54',
      },
    });

    export default CircularProgress;
