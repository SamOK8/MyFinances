package com.example.myfinances;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class QuartzSmokeTest {

    @Autowired
    ApplicationContext ctx;

    @Test
    void contextLoadsAndJobDetailBeanPresent() {
        assertThat(ctx).isNotNull();
        // The JobDetailFactoryBean registers a bean named 'printTimeJobDetail'
        assertThat(ctx.containsBean("printTimeJobDetail")).isTrue();
    }
}
